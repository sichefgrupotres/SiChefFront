"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useSession } from "next-auth/react";
// Import icons if you are using lucide-react, otherwise use material symbols inside span
import { Crown, Sparkles } from "lucide-react";

export default function CreatorPage() {
    const { dataUser, isLoadingUser } = useAuth();
    const { data: session, update } = useSession();

    const userInfo = dataUser?.user;
    const fullName = userInfo
        ? `${userInfo.name} ${userInfo.lastname}`
        : "Chef Invitado";

    // 1. VERIFICAMOS EL ROL
    const isPremium = session?.user?.role === "PREMIUM";

    const [avatar, setAvatar] = useState(
        dataUser?.user?.avatarUrl || "/chef-avatar.jpg"
    );

    const [uploading, setUploading] = useState(false);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !session?.backendToken) return;

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/avatar`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${session.backendToken}`,
                    },
                    body: formData,
                }
            );

            if (!res.ok) {
                console.error("Error subiendo avatar");
                return;
            }

            const data = await res.json();
            setAvatar(data.avatarUrl);

            await update({
                ...session,
                user: {
                    ...session.user,
                    avatarUrl: data.avatarUrl,
                },
            });
        } catch (error) {
            console.error("Error en la subida:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 p-4 pb-28 bg-[#181411] min-h-screen px-4 sm:px-8 lg:px-16">

            {/* SECCIÓN PERFIL */}
            <section className="px-4 md:px-8 py-10 flex flex-col items-center gap-4 text-center">
                <div className="relative w-32 h-32">
                    {/* Borde dinámico: Dorado si es premium, Blanco si es normal */}
                    <div className={`absolute -inset-1 rounded-full ${isPremium ? "bg-gradient-to-r from-yellow-400 to-orange-500 blur-sm" : ""}`}></div>

                    <img
                        src={session?.user?.avatarUrl || "/chef-avatar.jpg"}
                        alt="Perfil"
                        className={`relative w-full h-full object-cover rounded-full shadow-sm transition-opacity duration-300 border-2 ${isPremium ? "border-yellow-400" : "border-white"} ${uploading ? "opacity-50" : "opacity-100"}`}
                    />

                    {uploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full z-10">
                            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    <label
                        className={`absolute bottom-0 right-0 translate-x-1 translate-y-1 
                        w-9 h-9 rounded-full bg-[#F57C00] flex items-center justify-center 
                        shadow-lg border-2 border-white transition z-20
                        ${uploading ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:scale-105 active:scale-95"}`}
                    >
                        <span className="material-symbols-outlined text-white text-[20px]">
                            {uploading ? "hourglass_empty" : "photo_camera"}
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                            disabled={uploading}
                        />
                    </label>
                </div>

                <div className="flex flex-col gap-1 items-center">
                    <h1 className="text-[#F57C00] text-3xl md:text-5xl font-bold capitalize flex items-center gap-2">
                        {isLoadingUser ? "Cargando..." : fullName}
                        {isPremium && <Crown size={34} className="text-yellow-400 fill-yellow-400" />}
                    </h1>

                    {userInfo?.email && (
                        <p className="text-gray-500 font-medium">{userInfo.email}</p>
                    )}
                </div>
            </section>

            {/* --- NUEVO: ESTADO DE SUSCRIPCIÓN --- */}
            <section className="flex justify-center px-4">
                <div className="w-full max-w-lg">
                    {isPremium ? (
                        /* Diseño para USUARIO PREMIUM */
                        <div className="bg-gradient-to-r from-[#2a221b] to-[#3a2e24] border border-yellow-500/30 rounded-2xl p-6 flex items-center justify-between shadow-lg shadow-yellow-500/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl"></div>

                            <div className="flex flex-col text-left z-10">
                                <span className="text-yellow-500 font-bold tracking-wider text-sm mb-1 flex items-center gap-1">
                                    <Sparkles size={14} /> MEMBRESÍA ACTIVA
                                </span>
                                <h3 className="text-white text-xl font-bold">Plan Premium </h3>
                                <p className="text-white/60 text-sm mt-1">Tienes acceso ilimitado a todo.</p>
                            </div>

                            <div className="z-10">
                                <button className="px-4 py-2 bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 rounded-lg text-sm font-semibold hover:bg-yellow-500/30 transition cursor-pointer">
                                    Gestionar
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Diseño para USUARIO GRATUITO (Invitación) */
                        <div className="bg-[#2a221b] border border-[#F57C00]/40 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg relative overflow-hidden group">
                            {/* Efecto hover decorativo */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F57C00]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                            <div className="text-center sm:text-left z-10">
                                <h3 className="text-white text-xl font-bold flex items-center justify-center sm:justify-start gap-2">
                                    Plan Gratuito
                                </h3>
                                <p className="text-gray-400 text-sm mt-1 max-w-xs">
                                    Pásate a Premium para desbloquear recetas exclusivas y funciones avanzadas.
                                </p>
                            </div>

                            <Link href="/pricing" className="z-10 whitespace-nowrap px-6 py-3 bg-[#F57C00] hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all transform active:scale-95">
                                Ser Premium
                            </Link>
                        </div>
                    )}
                </div>
            </section>
            {/* ------------------------------------ */}

            <section className="px-4 md:px-8 pb-8">
                <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-orange-500 pl-3">
                    Favoritos
                </h2>
                {/* Aquí iría tu componente de favoritos */}
            </section>

        </div>
    );
}