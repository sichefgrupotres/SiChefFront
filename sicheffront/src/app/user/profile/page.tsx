"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useSession } from "next-auth/react";
import { Crown, Sparkles, Heart, Lock } from "lucide-react";
import RecipeCard from "@/components/Recipes/CardRecipe";
import { RecipeInterface } from "@/interfaces/IRecipe";

export default function UserPage() {
    const { dataUser, isLoadingUser } = useAuth();
    const { data: session, update } = useSession();

    const userInfo = dataUser?.user;
    const fullName = userInfo
        ? `${userInfo.name} ${userInfo.lastname}`
        : "Chef Invitado";

    // 👇 CORRECCIÓN: Estandarizamos la lógica Premium aquí
    const user = session?.user as any;
    const isPremium = user?.isPremium === true || user?.role === "PREMIUM";

    const [favorites, setFavorites] = useState<RecipeInterface[]>([]);
    const [loadingFavs, setLoadingFavs] = useState(true);

    const [avatar, setAvatar] = useState(
        dataUser?.user?.avatarUrl || "/chef-avatar.jpg"
    );
    const [uploading, setUploading] = useState(false);

    // ================= FETCH FAVORITOS =================
    useEffect(() => {
        if (session?.backendToken) {
            const fetchFavorites = async () => {
                setLoadingFavs(true);
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/favorites/my-list`, {
                        headers: { Authorization: `Bearer ${session.backendToken}` }
                    });

                    if (res.ok) {
                        const data = await res.json();
                        // Aseguramos que tengan la propiedad isFavorite para la UI
                        setFavorites(data.map((item: any) => ({ ...item, isFavorite: true })));
                    }
                } catch (error) {
                    console.error("Error cargando favoritos:", error);
                } finally {
                    setLoadingFavs(false);
                }
            };
            fetchFavorites();
        }
    }, [session]);

    // Calcular límite
    const favoritesCount = favorites.length;
    const maxFavorites = 5;
    const isLimitReached = !isPremium && favoritesCount >= maxFavorites;

    // Eliminar visualmente
    const handleRemoveFromFavs = (id: string | number) => {
        setFavorites(prev => prev.filter(r => r.id !== id));
    };

    // Subida de Avatar
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !session?.backendToken) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/avatar`, {
                method: "POST",
                headers: { Authorization: `Bearer ${session.backendToken}` },
                body: formData,
            });
            if (res.ok) {
                const data = await res.json();
                setAvatar(data.avatarUrl);
                await update({ ...session, user: { ...session.user, avatarUrl: data.avatarUrl } });
            }
        } catch (error) {
            console.error("Error subiendo avatar", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 p-4 pb-28 bg-[#181411] min-h-screen px-4 sm:px-8 lg:px-16">

            {/* SECCIÓN PERFIL */}
            <section className="px-4 md:px-8 py-10 flex flex-col items-center gap-4 text-center">
                <div className="relative w-32 h-32">
                    <div className={`absolute -inset-1 rounded-full ${isPremium ? "bg-gradient-to-r from-yellow-400 to-orange-500 blur-sm" : ""}`}></div>
                    <img
                        src={session?.user?.avatarUrl || "/chef-avatar.jpg"}
                        alt="Perfil"
                        className={`relative w-full h-full object-cover rounded-full shadow-sm border-2 ${isPremium ? "border-yellow-400" : "border-white"} ${uploading ? "opacity-50" : "opacity-100"}`}
                    />
                    {uploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full z-10">
                            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                    <label className={`absolute bottom-0 right-0 translate-x-1 translate-y-1 w-9 h-9 rounded-full bg-[#F57C00] flex items-center justify-center shadow-lg border-2 border-white transition z-20 ${uploading ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:scale-105"}`}>
                        <span className="material-symbols-outlined text-white text-[20px]">{uploading ? "hourglass_empty" : "photo_camera"}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={uploading} />
                    </label>
                </div>

                <div className="flex flex-col gap-1 items-center">
                    <h1 className="text-[#F57C00] text-3xl md:text-5xl font-bold capitalize flex items-center gap-2">
                        {isLoadingUser ? "Cargando..." : fullName}
                        {isPremium && <Crown size={34} className="text-yellow-400 fill-yellow-400" />}
                    </h1>
                    {userInfo?.email && <p className="text-gray-500 font-medium">{userInfo.email}</p>}
                </div>
            </section>

            {/* --- ESTADO DE SUSCRIPCIÓN Y CONTADOR DE FAVORITOS --- */}
            <section className="flex justify-center px-4">
                <div className="w-full max-w-lg">
                    {isPremium ? (
                        <div className="bg-gradient-to-r from-[#2a221b] to-[#3a2e24] border border-yellow-500/30 rounded-2xl p-6 flex items-center justify-between shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl"></div>
                            <div className="flex flex-col text-left z-10">
                                <span className="text-yellow-500 font-bold tracking-wider text-sm mb-1 flex items-center gap-1">
                                    <Sparkles size={14} /> MEMBRESÍA ACTIVA
                                </span>
                                <h3 className="text-white text-xl font-bold">Plan Premium</h3>
                                <p className="text-white/60 text-sm mt-1">Favoritos ilimitados y acceso total.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#2a221b] border border-[#F57C00]/40 rounded-2xl p-6 flex flex-col gap-4 shadow-lg relative overflow-hidden">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-white text-xl font-bold">Plan Gratuito</h3>
                                    <p className="text-gray-400 text-sm mt-1">Límite de 5 favoritos.</p>
                                </div>
                                <Link href="/subscription" className="px-4 py-2 bg-[#F57C00] hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-all">
                                    Ser Premium
                                </Link>
                            </div>

                            {/* BARRA DE PROGRESO DE FAVORITOS */}
                            <div className="mt-2">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-300">Favoritos usados</span>
                                    <span className={isLimitReached ? "text-red-400 font-bold" : "text-gray-300"}>
                                        {favoritesCount} / {maxFavorites}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2.5">
                                    <div
                                        className={`h-2.5 rounded-full transition-all duration-500 ${isLimitReached ? "bg-red-500" : "bg-green-500"}`}
                                        style={{ width: `${Math.min((favoritesCount / maxFavorites) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                {isLimitReached && (
                                    <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                                        <Lock size={12} /> Has alcanzado tu límite. Elimina recetas o hazte Premium.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* --- LISTA DE FAVORITOS --- */}
            <section className="px-4 md:px-8 pb-8 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-3 mb-6 border-l-4 border-orange-500 pl-3">
                    <h2 className="text-2xl font-bold text-white">Mis Favoritos</h2>
                    <span className="bg-[#F57C00] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {favoritesCount}
                    </span>
                </div>

                {loadingFavs ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin h-8 w-8 border-2 border-[#F57C00] rounded-full border-t-transparent"></div>
                    </div>
                ) : favorites.length === 0 ? (
                    <div className="text-center text-gray-500 py-16 bg-[#2a221b]/30 rounded-xl border border-gray-800 border-dashed flex flex-col items-center gap-2">
                        <Heart className="text-gray-600" size={40} />
                        <p>Aún no tienes recetas favoritas.</p>
                        <Link href="/user" className="text-orange-500 hover:underline text-sm">
                            Explorar recetas
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favorites.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                mode="user"
                                onRemove={() => handleRemoveFromFavs(recipe.id)}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}