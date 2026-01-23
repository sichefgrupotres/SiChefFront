"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RecipeInterface } from "@/interfaces/IRecipe";
import { BarChart3, Crown } from "lucide-react";
import FavoriteButton from "../FavoriteButton";
import { useAuth } from "@/context/AuthContext";
import PremiumModal from "../../components/PremiumModal"

interface RecipeCardProps {
  recipe: RecipeInterface;
  mode?: "creator" | "guest" | "admin" | "user";
  onRemove?: () => void;
}

const RecipeCard = ({
  recipe,
  mode = "creator",
  onRemove,
}: RecipeCardProps) => {
  const router = useRouter();
  const [showChatModal, setShowChatModal] = useState(false);

  const href =
    mode === "creator"
      ? `/creator/recipes/${recipe.id}`
      : mode === "admin"
        ? `/admin/content/${recipe.id}`
        : mode === "user"
          ? `/user/recipes/${recipe.id}`
          : `/guest/recipes/${recipe.id}`;

  const { dataUser, isLoadingUser } = useAuth();

  if (isLoadingUser) return null;

  const user = dataUser?.user;
  const role = user?.role;

  const isAdmin = role === "ADMIN";
  // const isCreator = role === "CREATOR"; // (No lo usamos visualmente aquí, pero lo dejo comentado)

  // 1. ¿Es un usuario normal (sea premium o no)?
  const isUserRole = role === "USER";

  // 2. ¿Es Premium? (Opción B: Propiedad del objeto usuario)
  // NOTA: Uso 'as any' para evitar error de TypeScript si tu interfaz User no tiene 'isPremium' definido aún.
  // Si tu propiedad se llama distinto (ej: 'subscription', 'plan'), cámbialo aquí.
  const isPremium = (user as any)?.isPremium === true;

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPremium) {
      // ✅ Es Premium -> Vamos al chat
      // IMPORTANTE: Asegúrate de que 'creatorId' o 'userId' exista en tu RecipeInterface
      // Si TypeScript se queja aquí, usa (recipe as any).creatorId temporalmente
      const creatorId = (recipe as any).creatorId || (recipe as any).userId;
      if (creatorId) {
        router.push(`/chat`);
      } else {
        console.error("No se encontró el ID del creador en la receta");
      }
    } else {
      // 🔒 No es Premium -> Modal
      setShowChatModal(true);
    }
  };

  return (
    <>
      <div className="relative flex flex-col w-full rounded-xl overflow-hidden shadow hover:shadow-xl transition bg-[#2a221b]">
        {/* Imagen */}
        <div className="relative w-full h-44">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />

          <div className="absolute top-3 right-3 z-10">
            <FavoriteButton
              recipeId={recipe.id}
              isPremiumRecipe={!!recipe.isPremium}
              initialIsFavorite={recipe.isFavorite}
              onToggle={(isNowFavorite) => {
                if (!isNowFavorite && onRemove) {
                  onRemove();
                }
              }}
            />
          </div>

          {/* Avatar Clickeable: Solo visible para usuarios (Role USER) */}
          {isUserRole && (
            <button
              onClick={handleAvatarClick}
              className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full hover:bg-black/80 transition cursor-pointer group border border-transparent hover:border-orange-500/50"
            >
              {recipe.avatarUrl ? (
                <img
                  src={recipe.avatarUrl}
                  alt={recipe.creatorName}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-[10px] font-bold text-white">
                  {recipe.creatorName?.charAt(0).toUpperCase()}
                </div>
              )}

              <span className="text-xs text-white truncate max-w-45 group-hover:text-orange-400 transition">
                {recipe.creatorName}
              </span>
            </button>
          )}
        </div>

        {/* Contenido Texto */}
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

      {/* Modal */}
      <PremiumModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        title="Chat con Chefs"
        description={`Hablar directamente con ${recipe.creatorName} es un beneficio exclusivo. Suscríbete a Premium para conectar.`}
        buttonText="Hacerme Premium"
      />
    </>
  );
};

export default RecipeCard;