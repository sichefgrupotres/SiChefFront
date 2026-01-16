"use client";

import { useState } from "react";
import { PATHROUTES } from "@/utils/PathRoutes";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import MyRecipesList from "@/components/Recipes/MyRecipesList";
import { useSession } from "next-auth/react";
// import MyTutorialsList from "@/components/Tutorials/MyTutorialsList";

export default function CreatorPage() {
  const { dataUser, isLoadingUser } = useAuth();

  const userInfo = dataUser?.user;
  const fullName = userInfo
    ? `${userInfo.name} ${userInfo.lastname}`
    : "Chef Invitado";

  const [avatar, setAvatar] = useState(
    dataUser?.user?.avatarUrl || "/chef-avatar.jpg"
  );

  const [uploading, setUploading] = useState(false);

  const { data: session, update } = useSession();

  const [activeTab, setActiveTab] = useState<"recipes" | "tutorials">(
    "recipes"
  );

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
      // 3. NUEVO: Desactivamos el spinner termine bien o mal
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-4 pb-28 bg-[#181411] min-h-screen px-4 sm:px-8 lg:px-16">
      <section className="px-4 md:px-8 py-16 flex flex-col items-center gap-4 text-center">
        <div className="relative w-32 h-32">
          <img
            src={session?.user?.avatarUrl || "/chef-avatar.jpg"}
            alt="Perfil"
            className={`w-full h-full object-cover rounded-full shadow-sm transition-opacity duration-300 ${
              uploading ? "opacity-50" : "opacity-100"
            }`}
          />

          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full z-10">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <label
            className={`absolute bottom-0 right-0 translate-x-1 translate-y-1 
            w-9 h-9 rounded-full bg-[#F57C00] flex items-center justify-center 
            shadow-lg border-2 border-white transition 
            ${
              uploading
                ? "cursor-not-allowed opacity-70"
                : "cursor-pointer hover:scale-105 active:scale-95"
            }`}>
            <span className="material-symbols-outlined text-white text-[20px]">
              {uploading ? "hourglass_empty" : "photo_camera"}
            </span>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              disabled={uploading} // Bloqueamos el input mientras carga
            />
          </label>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-[#F57C00] text-3xl md:text-5xl font-bold capitalize">
            {isLoadingUser ? "Cargando..." : fullName}
          </h1>

          {userInfo?.email && (
            <p className="text-gray-500 font-medium">{userInfo.email}</p>
          )}
        </div>
      </section>

      <section className="px-4 md:px-8 pb-8">
        <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-orange-500 pl-3">
          Descripcion general
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-[#2a221b] rounded-xl p-4">
            <p className="text-sm text-white/60">Vistas</p>
            <p className="text-xl font-semibold text-[#e6e0db]">12.5k</p>
          </div>

          <div className="bg-[#2a221b] rounded-xl p-4">
            <p className="text-sm text-white/60">Seguidores</p>
            <p className="text-xl font-semibold text-[#e6e0db]">850</p>
          </div>

          <div className="bg-[#2a221b] rounded-xl p-4">
            <p className="text-sm text-white/60">Calificación</p>
            <p className="text-xl font-semibold text-[#e6e0db]">4.8</p>
          </div>
        </div>
      </section>

      {/* ACTIONS */}
      <section className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
        <Link
          href={PATHROUTES.NEWRECIPE}
          className="w-full sm:w-48 py-3 rounded-lg bg-orange-500/20 text-[#F57C00] font-semibold
                    flex items-center justify-center gap-2
                    hover:bg-[#F57C00] hover:text-white transition-all active:scale-95">
          <span className="material-symbols-outlined text-[26px]">
            restaurant_menu
          </span>
          <span>Nueva Receta</span>
        </Link>

        <Link href={PATHROUTES.NEWTUTORIAL}>
          <button
            className="w-full sm:w-48 py-3 rounded-lg bg-orange-500/20 text-[#F57C00] font-semibold
                    flex items-center justify-center gap-2
                    hover:bg-[#F57C00] hover:text-white transition-all active:scale-95 cursor-pointer">
            <span className="material-symbols-outlined text-[26px]">
              video_camera_front
            </span>
            <span>Nuevo tutorial</span>
          </button>
        </Link>
      </section>

      <section className="px-4 md:px-8">
        <div className="flex gap-6 border-b border-white/10">
          <button
            onClick={() => setActiveTab("recipes")}
            className={`pb-3 font-semibold transition cursor-pointer
              ${
                activeTab === "recipes"
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-400 hover:text-white"
              }`}>
            Mis Recetas
          </button>

          <button
            onClick={() => setActiveTab("tutorials")}
            className={`pb-3 font-semibold transition cursor-pointer
              ${
                activeTab === "tutorials"
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-400 hover:text-white"
              }`}>
            Mis Tutoriales
          </button>
        </div>
      </section>

      <section className="px-4 md:px-8 pb-16 bg-[#181411]">
        {activeTab === "recipes" && <MyRecipesList />}

        {activeTab === "tutorials" && (
          <div className="text-gray-400 text-center py-16">
            Aún no tienes tutoriales publicados
          </div>
        )}
      </section>
    </div>
  );
}
