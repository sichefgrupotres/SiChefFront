"use client";

import Link from "next/link";
import {  } from "@/interfaces/IRecipe";
import { BarChart3, Crown, Heart } from "lucide-react";
import { TutorialInterface } from "@/interfaces/ITutorial";

interface TutorialCardProps {
  tutorial: TutorialInterface;
  // 1. Agregamos "user" a las opciones permitidas
  mode?: "creator" | "guest" | "admin" | "user";
}

const TutorialCard = ({ tutorial, mode = "creator" }: TutorialCardProps) => {

  // 2. Actualizamos la lógica de redirección
  const href =
    mode === "creator"
      ? `/creator/tutorials/${tutorial.id}`
      : mode === "admin"
        ? `/admin/content/${tutorial.id}`
        : mode === "user"
          ? `/user/tutorials/${tutorial.id}` // <--- Ruta para el usuario logueado (ajusta si es /user/tutorials/)
          : `/guest/tutorials/${tutorial.id}`;

  return (
    <div className="relative flex flex-col w-full rounded-xl overflow-hidden shadow hover:shadow-xl transition bg-[#2a221b]">
      {/* Imagen */}
      <div className="relative w-full h-44">
        <img
          src={tutorial.videoUrl}
          alt={tutorial.title}
          className="w-full h-full object-cover"
        />

        {/* Favorito */}
        <button className="absolute top-3 right-3 z-10 bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-black/70 transition">
          <Heart
            size={18}
            className="text-white hover:fill-red-500 hover:text-red-500 transition cursor-pointer"
          />
        </button>
      </div>

      {/* Contenido */}
      <div className="flex flex-col justify-between flex-1 p-3 gap-2">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold text-white truncate capitalize text-base">
            {tutorial.title}
          </p>

          <div className="flex items-center gap-2 text-xs text-white/80 shrink-0">
           


          </div>
        </div>

        <Link href={href}>
          <button className="w-full bg-[#F57C00] text-white py-1.5 rounded-lg hover:bg-orange-600 transition text-sm cursor-pointer font-medium">
            Ver receta
          </button>
        </Link>
      </div>
    </div>
  );
};

export default TutorialCard;