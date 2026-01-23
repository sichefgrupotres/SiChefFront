"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
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
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. Verificar Login
    if (!session || !session.user) {
      Swal.fire({
        title: "Inicia sesión",
        text: "Debes iniciar sesión para guardar favoritos",
        icon: "warning",
        confirmButtonColor: "#F57C00",
        confirmButtonText: "Ir a Login"
      }).then((result) => {
        if (result.isConfirmed) router.push("/login");
      });
      return;
    }

    const sessionData = session as any;
    const userData = session.user as any;
    const token = userData.backendToken || sessionData.backendToken;
    const userRole = userData.role || userData.roleId;

    const userIsPremium = userData?.isPremium === true || userRole === "PREMIUM";
    const isSpecialUser = userRole === "ADMIN" || userRole === "creator" || userRole === "CREATOR";

    // 2. Bloqueo si la receta es Premium y el usuario no
    if (isPremiumRecipe && !userIsPremium && !isSpecialUser) {
      setShowPremiumModal(true);
      return;
    }

    if (!token) {
      // Manejo de error de token perdido
      Swal.fire({ title: "Error", text: "Sesión inválida.", icon: "error" });
      return;
    }

    // 3. UI Optimista (Cambiamos el corazón visualmente antes de esperar al server)
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
        }
      );

      const data = await res.json();

      if (!res.ok) {
        // 🛑 AQUÍ CAPTURAMOS EL LÍMITE
        if (data.message && data.message.includes("Límite")) {
          // Revertimos el corazón porque falló
          setIsFavorite(previousState);
          if (onToggle) onToggle(previousState);

          // Mostramos alerta bonita
          Swal.fire({
            title: "¡Límite alcanzado!",
            text: "Has llegado al límite de 5 recetas favoritas del plan gratuito.",
            icon: "error",
            showCancelButton: true,
            confirmButtonColor: "#F57C00",
            cancelButtonColor: "#333",
            confirmButtonText: "Ser Premium ",
            cancelButtonText: "Entendido",
            background: "#1f1a16", // Estilo oscuro acorde a tu app
            color: "#fff"
          }).then((result) => {
            if (result.isConfirmed) {
              router.push("/subscription"); // Redirige a comprar
            }
          });
        } else {
          throw new Error(data.message || "Error desconocido");
        }

        // Lanzamos error para detener el flujo
        throw new Error("Action blocked");
      }

      console.log("✅ Favorito actualizado correctamente");

    } catch (error: any) {
      if (error.message !== "Action blocked") {
        console.error("Error al dar like:", error);
        // Si falló por otra cosa (internet, server caído), revertimos
        setIsFavorite(previousState);
        if (onToggle) onToggle(previousState);
      }
    } finally {
      setLoading(false);
    }
  };

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

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        title="Receta Premium"
        description="Esta receta es exclusiva. Suscríbete para poder guardarla en favoritos."
      />
    </>
  );
}