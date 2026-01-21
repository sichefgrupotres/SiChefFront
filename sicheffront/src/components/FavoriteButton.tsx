"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
// 👇 1. Importamos tu Modal
import PremiumModal from "./PremiumModal";

interface FavoriteButtonProps {
  recipeId: string | number;
  isPremiumRecipe: boolean;
  initialIsFavorite?: boolean;
  onToggle?: (isFavorite: boolean) => void;
}

export default function FavoriteButton({
  recipeId,
  isPremiumRecipe,
  initialIsFavorite = false,
  onToggle,
}: FavoriteButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  // 👇 2. Estado para controlar tu Modal
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session || !session.user) {
      Swal.fire({
        title: "Inicia sesión",
        text: "Debes iniciar sesión para guardar favoritos",
        icon: "warning",
        confirmButtonColor: "#F57C00",
      }).then(() => {
        router.push("/login");
      });
      return;
    }

    const sessionData = session as any;
    const userData = session.user as any;
    const token = userData.backendToken || sessionData.backendToken;
    const userRole = userData.role || userData.roleId;
    const userIsPremium = userData.isPremium;

    const isSpecialUser =
      userRole === "admin" || userRole === "creator" || userRole === "CREATOR";

    // 👇👇 CAMBIO AQUÍ: Si es premium y el usuario no, abrimos TU MODAL 👇👇
    if (isPremiumRecipe && !userIsPremium && !isSpecialUser) {
      // QUITAMOS EL SWAL.FIRE DE AQUÍ
      setShowPremiumModal(true);
      return; // Detenemos la ejecución
    }
    // 👆👆 FIN DEL CAMBIO 👆👆

    if (!token) {
      console.error("❌ No se encontró el token.");

      Swal.fire({
        title: "Error",
        text: "Error de sesión: No se encontró tu token.",
        icon: "warning",
        confirmButtonColor: "#F57C00",
      }).then(() => {
        router.push("/login");
      });
      return;
    }

    // Optimistic UI
    const previousState = isFavorite;
    const newState = !isFavorite;
    setIsFavorite(newState);
    if (onToggle) onToggle(newState);

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${recipeId}/favorite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        if (data.message && data.message.includes("Límite")) {
          alert(
            "🛑 ¡LÍMITE DE 5 FAVORITOS ALCANZADO!\n\nElimina una receta de tus favoritos o pásate a Premium para guardar sin límites. ⭐",
          );
        } else if (res.status === 401) {
          throw new Error("No autorizado");
        } else {
          throw new Error(data.message || "Error al actualizar");
        }

        throw new Error("Action blocked");
      }

      console.log("✅ Favorito actualizado");
    } catch (error: any) {
      if (error.message !== "Action blocked") {
        console.error("Error al dar like:", error);
        if (error.message.includes("No autorizado")) {
          alert("Tu sesión ha expirado.");
        }
      }

      setIsFavorite(previousState);
      if (onToggle) onToggle(previousState);
    } finally {
      setLoading(false);
    }
  };

  // 👇 3. Renderizamos el botón Y el modal condicionalmente
  return (
    <>
      <button
        onClick={toggleFavorite}
        disabled={loading}
        className={`cursor-pointer p-2 rounded-full transition-all duration-300 shadow-md flex items-center justify-center group
        ${isFavorite
            ? "bg-white text-red-500 hover:bg-red-50"
            : "bg-black/40 text-white hover:bg-red-500 hover:text-white backdrop-blur-sm"
          }
      `}
        title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
      >
        <Heart
          size={20}
          className={`transition-all duration-300 ${isFavorite ? "fill-current scale-110" : "group-hover:scale-110"
            }`}
        />
      </button>

      {/* MODAL PREMIUM */}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />
    </>
  );
}