"use client";

import Link from "next/link";
import { RecipeInterface } from "@/interfaces/IRecipe";
import { BarChart3, Crown, Heart } from "lucide-react";

interface RecipeCardProps {
  recipe: RecipeInterface;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <div className="relative flex flex-col w-86 h-76 rounded-xl overflow-hidden shadow hover:shadow-xl transition">
      {/* Imagen */}
      <img
        src={recipe.imageUrl}
        alt={recipe.title}
        className="w-full h-50 object-cover"
      />

      {/* Favorito */}
      <button className="absolute top-3 right-3 z-10 bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-black/70 transition">
        <Heart
          size={18}
          className="text-white hover:fill-red-500 hover:text-red-500 transition cursor-pointer"
        />
      </button>

      {/* Contenido */}
      <div className="flex flex-col justify-between flex-1 bg-[#2a221b] p-3 gap-2">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold text-white truncate capitalize">
            {recipe.title}
          </p>

          <div className="flex items-center gap-2 text-sm text-white/80">
            <div className="flex items-center gap-1">
              <BarChart3 size={14} />
              <span className="capitalize">{recipe.difficulty}</span>
            </div>

            {recipe.isPremium === true && (
              <span className="text-xs bg-[#F57C00] text-white px-2 py-0.5 rounded-full">
                <Crown size={14} />
              </span>
            )}
          </div>
        </div>

        <Link href={`/creator/recipes/${recipe.id}`}>
          <button className="w-full bg-[#F57C00] text-white py-1.5 rounded-lg hover:bg-orange-500 transition text-sm cursor-pointer">
            Ver receta
          </button>
        </Link>
      </div>
    </div>
  );
};

export default RecipeCard;
