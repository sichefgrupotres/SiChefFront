"use client";

import { useState } from "react";
import { PATHROUTES } from "@/utils/PathRoutes";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function CreatorPage() {
    const { dataUser, isLoadingUser } = useAuth();

    const userInfo = dataUser?.user;
    const fullName = userInfo
        ? `${userInfo.name} ${userInfo.lastname}`
        : "Chef Invitado";

    // 🔹 Imagen de perfil (preview)
    const [avatar, setAvatar] = useState("/chef-avatar.jpg");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const imageUrl = URL.createObjectURL(file);
        setAvatar(imageUrl);
    };

    return (
        <div className="flex flex-col gap-8 p-4 pb-28 bg-[#181411] min-h-screen px-4 sm:px-8 lg:px-16">

            {/* PERFIL */}
            <section className="px-4 md:px-8 py-16 flex flex-col items-center gap-4 text-center">

                {/* Avatar */}
                <div className="relative w-32 h-32">
                    {/* Imagen */}
                    <img
                        src={avatar}
                        alt="Avatar grande"
                        className="w-full h-full rounded-full object-cover border-4 border-[#F57C00] shadow-xl"
                    />

                    {/* Botón cámara */}
                    <label className="absolute bottom-0 right-0 translate-x-1 translate-y-1 
                        w-9 h-9 rounded-full bg-[#F57C00] flex items-center justify-center 
                        cursor-pointer shadow-lg hover:scale-105 transition active:scale-95">

                        <span className="material-symbols-outlined text-white text-[20px]">
                            photo_camera
                        </span>

                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </label>
                </div>

                {/* Nombre y email */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-[#F57C00] text-3xl md:text-5xl font-bold capitalize">
                        {isLoadingUser ? "Cargando..." : fullName}
                    </h1>

                    {userInfo?.email && (
                        <p className="text-gray-500 font-medium">
                            {userInfo.email}
                        </p>
                    )}
                </div>
            </section>

            {/* OVERVIEW */}
            <section>
                <h2 className="text-lg font-semibold mb-4 text-[#e6e0db]">
                    Descripción general
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-[#2a221b] rounded-xl p-4">
                        <p className="text-sm text-white/60">Vistas</p>
                        <p className="text-xl font-semibold text-[#e6e0db]">
                            12.5k
                        </p>
                    </div>

                    <div className="bg-[#2a221b] rounded-xl p-4">
                        <p className="text-sm text-white/60">Seguidores</p>
                        <p className="text-xl font-semibold text-[#e6e0db]">
                            850
                        </p>
                    </div>

                    <div className="bg-[#2a221b] rounded-xl p-4">
                        <p className="text-sm text-white/60">Calificación</p>
                        <p className="text-xl font-semibold text-[#e6e0db]">
                            4.8
                        </p>
                    </div>
                </div>
            </section>

            {/* ACTIONS */}
            <section className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
                <Link
                    href={PATHROUTES.NEWRECIPE}
                    className="w-full sm:w-48 py-3 rounded-lg bg-orange-500/20 text-[#F57C00] font-semibold
                    flex items-center justify-center gap-2
                    hover:bg-[#F57C00] hover:text-white transition-all active:scale-95"
                >
                    <span className="material-symbols-outlined text-[26px]">
                        restaurant_menu
                    </span>
                    <span>Nueva Receta</span>
                </Link>

                <button
                    className="w-full sm:w-48 py-3 rounded-lg bg-orange-500/20 text-[#F57C00] font-semibold
                    flex items-center justify-center gap-2
                    hover:bg-[#F57C00] hover:text-white transition-all active:scale-95"
                >
                    <span className="material-symbols-outlined text-[26px]">
                        video_camera_front
                    </span>
                    <span>Nuevo tutorial</span>
                </button>
            </section>

            {/* PERFORMANCE */}
            <section className="bg-[#2a221b] rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-[#e6e0db]">
                        Actuación (30 días)
                    </h3>
                    <span className="text-green-400 text-sm">+12%</span>
                </div>

                <div className="h-32 bg-[#1E1B18] rounded-lg flex items-center justify-center text-white/40">
                    Marcador de posición del gráfico
                </div>
            </section>

            {/* BORRADORES */}
            <section>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-[#e6e0db]">
                        Borradores recientes
                    </h3>
                    <button className="text-orange-500 text-sm">
                        Administrar
                    </button>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="bg-[#2a221b] rounded-xl p-3 flex justify-between items-center">
                        <div>
                            <p className="font-medium text-[#e6e0db]">
                                Ensalada de quinoa de verano
                            </p>
                            <p className="text-sm text-white/50">
                                Editado hace 2h
                            </p>
                        </div>
                        <button>✏️</button>
                    </div>

                    <div className="bg-[#2a221b] rounded-xl p-3 flex justify-between items-center">
                        <div>
                            <p className="font-medium text-[#e6e0db]">
                                Tutorial básico de masa madre
                            </p>
                            <p className="text-sm text-white/50">
                                Editado ayer
                            </p>
                        </div>
                        <button>✏️</button>
                    </div>
                </div>
            </section>
        </div>
    );
}
