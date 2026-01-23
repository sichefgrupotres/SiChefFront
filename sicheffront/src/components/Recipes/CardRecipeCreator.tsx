"use client";

import Link from "next/link";
import { RecipeInterface } from "@/interfaces/IRecipe";
import { BarChart3, Crown, Pencil, Trash2 } from "lucide-react";

interface RecipeCardProps {
  recipe: RecipeInterface;
  mode?: "creator" | "admin" | "user" | "guest";
  onRemove?: () => void;
  onEdit?: () => void;
}

const RecipeCardCreator = ({
  recipe,
  mode = "creator",
  onRemove,
  onEdit,
}: RecipeCardProps) => {
  const href =
    mode === "creator"
      ? `/creator/recipes/${recipe.id}`
      : mode === "admin"
        ? `/admin/content/${recipe.id}`
        : mode === "user"
          ? `/user/recipes/${recipe.id}`
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

        <div className="absolute top-3 right-3 z-10">
          {/* <FavoriteButton
            recipeId={recipe.id}
            isPremiumRecipe={!!recipe.isPremium}
            initialIsFavorite={recipe.isFavorite}
            // 👇 AQUÍ CONECTAMOS EL CABLE
            onToggle={(isNowFavorite) => {
              // Si el usuario quitó el like (false) Y tenemos una función de remover...
              if (!isNowFavorite && onRemove) {
                onRemove(); // ...ejecutamos la orden de borrar visualmente
              }
            }}
          /> */}

          {mode === "creator" && (
            <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-lg">
              <button
                onClick={onEdit}
                className="text-white hover:text-orange-400 transition"
                title="Editar receta">
                <Pencil size={18} className="cursor-pointer" />
              </button>

              <button
                onClick={onRemove}
                className="text-white hover:text-red-400 transition"
                title="Eliminar receta">
                <Trash2 size={18} className="cursor-pointer" />
              </button>
            </div>
          )}
        </div>
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

export default RecipeCardCreator;
