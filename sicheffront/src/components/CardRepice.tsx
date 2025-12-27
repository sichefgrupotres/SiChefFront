"use client";

import Link from "next/link";
import { RecipeInterface } from "@/interfaces/IRepice";

interface RecipeCardProps {
  recipe: RecipeInterface;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <div className="flex flex-col w-72 h-96 bg-[#2a221b] rounded-xl shadow hover:shadow-xl transition p-4 gap-3">
      {/* Imagen */}
      <img
        // src={recipe.image}
        alt={recipe.title}
        className="w-full h-40 object-cover rounded-lg"
      />

      {/* Título */}
      <p className="font-semibold text-white text-center wrap-break-words min-h-12">
        {recipe.title}
      </p>

      {/* Meta info */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-white/70 capitalize">{recipe.difficulty}</span>

        {recipe.isPremium && (
          <span className="text-xs bg-[#F57C00] text-white px-2 py-1 rounded-full">
            Premium
          </span>
        )}
      </div>

      {/* Acción */}
      <Link href={`/recipes/${recipe.id}`}>
        <button className="w-full mt-2 bg-orange-500/20 text-[#F57C00] py-2 rounded-lg hover:bg-[#F57C00] hover:text-white transition-all active:scale-95  cursor-pointer font-semibold">
          Ver receta
        </button>
      </Link>
    </div>
  );
};

export default RecipeCard;
