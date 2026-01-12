"use client";

import Link from "next/link";
import { RecipeInterface } from "@/interfaces/IRecipe";
import { BarChart3, Crown, Heart } from "lucide-react";

interface RecipeCardProps {
  recipe: RecipeInterface;
  mode?: "creator" | "guest" | "admin"; // Nueva opción para el admin
}

const RecipeCard = ({ recipe, mode = "creator" }: RecipeCardProps) => {
  // Enlace para admins
  const href =
    mode === "creator"
      ? `/creator/${recipe.id}`
      : mode === "admin"
      ? `/admin/content/${recipe.id}` // Redirigir a la página de receta admin
      : `/guest/recipes/${recipe.id}`;

  return (
    <div className="relative flex flex-col w-full rounded-xl overflow-hidden shadow hover:shadow-xl transition bg-[#2a221b]">
      {/* Imagen */}
      <div className="relative w-full h-44">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
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
            {recipe.title}
          </p>

          <div className="flex items-center gap-2 text-xs text-white/80 shrink-0">
            <div className="flex items-center gap-1">
              <BarChart3 size={14} />
              <span className="capitalize">{recipe.difficulty}</span>
            </div>

            {recipe.isPremium === true && (
              <span className="text-[10px] bg-[#F57C00] text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                <Crown size={12} />
              </span>
            )}
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

export default RecipeCard;
