"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// Eliminamos import de sonner

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

    // Sincronizar estado si cambia la prop inicial
    useEffect(() => {
        setIsFavorite(initialIsFavorite);
    }, [initialIsFavorite]);

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!session || !session.user) {
            alert("Debes iniciar sesión para guardar favoritos");
            router.push("/login");
            return;
        }

        // 👇 TRUCO PARA EVITAR ERRORES DE TYPESCRIPT Y ENCONTRAR EL TOKEN
        const sessionData = session as any;
        const userData = session.user as any;

        // Buscamos el token en ambos lugares por seguridad
        const token = userData.backendToken || sessionData.backendToken;
        const userRole = userData.role || userData.roleId; // Por si se llama distinto
        const userIsPremium = userData.isPremium;

        // 👇 LÓGICA DE PERMISOS (INCLUYE CREADORES)
        // Si la receta es Premium... Y el usuario NO es Premium... Y NO es Admin/Creador... -> Bloqueamos
        const isSpecialUser = userRole === "admin" || userRole === "creator" || userRole === "CREATOR";

        if (isPremiumRecipe && !userIsPremium && !isSpecialUser) {
            alert("Esta receta es exclusiva para usuarios Premium ⭐");
            return;
        }

        if (!token) {
            console.error("❌ No se encontró el token de autenticación en la sesión.");
            alert("Error de sesión: No se encontró tu token. Intenta reloguearte.");
            return;
        }

        // Optimistic UI (Cambio visual inmediato)
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
                        "Authorization": `Bearer ${token}`, // Enviamos el token encontrado
                    },
                }
            );

            if (!res.ok) {
                if (res.status === 401) {
                    throw new Error("No autorizado (Token inválido o expirado)");
                }
                throw new Error("Error al actualizar favorito");
            }

            console.log("✅ Favorito actualizado correctamente");

        } catch (error) {
            console.error("Error al dar like:", error);
            // Revertimos cambio visual si falló
            setIsFavorite(previousState);
            if (onToggle) onToggle(previousState);

            // Mensaje amigable si es 401
            if (error instanceof Error && error.message.includes("No autorizado")) {
                alert("Tu sesión ha expirado. Por favor inicia sesión nuevamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={toggleFavorite}
            disabled={loading}
            className={`p-2 rounded-full transition-all duration-300 shadow-md flex items-center justify-center group
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
    );
}