"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { ArrowLeft, BarChart3, Crown, Link } from "lucide-react";

interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string;
  difficulty: "facil" | "medio" | "dificil";
  imageUrl: string;
  isPremium: boolean;
}

export default function GuestRecipePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      try {
        const res = await fetch(`http://localhost:3001/posts/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.status === 404) {
          router.push("/404");
          return;
        }

        if (!res.ok) throw new Error();

        const data = await res.json();
        setRecipe(data);
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar la receta",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-white">
        Cargando receta...
      </div>
    );
  }

  if (!recipe) return null;

  const isPremium = recipe.isPremium;
  const isEasy = recipe.difficulty === "facil";
  const isMediumOrHard =
    recipe.difficulty === "medio" || recipe.difficulty === "dificil";

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* ===== BOTÓN VOLVER A HOME GUEST ===== */}
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 mb-4 transition"
      >
        <ArrowLeft size={16} />
        Volver a recetas
      </button>
      {/* Imagen */}
      <div className="w-full h-64 rounded-xl overflow-hidden mb-6">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Header */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">{recipe.title}</h1>

          {recipe.isPremium && (
            <span className="flex items-center gap-1 text-sm bg-[#F57C00] px-3 py-1 rounded-full text-white">
              <Crown size={14} />
              Premium
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-white/80">
          <BarChart3 size={16} />
          <span className="capitalize">{recipe.difficulty}</span>
        </div>
      </div>

      {/* ================= CTA SUSCRIPCIÓN (SOLO PREMIUM) ================= */}
      {isPremium && (
        <section className="bg-[#2a221b] rounded-xl p-8 border border-[#F57C00]/40 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent" />

          <div className="relative z-10 flex flex-col items-center gap-4">
            <span className="flex items-center gap-2 text-[#F57C00] font-semibold text-sm">
              <Crown size={18} />
              Receta Premium
            </span>

            <h2 className="text-2xl font-bold text-white">
              Desbloquea esta receta completa 🍽️
            </h2>

            <p className="text-white/80 max-w-md">
              Accede a ingredientes detallados, pasos de preparación completos
              y a todas nuestras recetas premium exclusivas.
            </p>

            <button
              onClick={() => router.push("/subscription")}
              className="px-6 py-3 rounded-full bg-[#F57C00] text-white font-semibold hover:bg-orange-600 transition shadow-md"
            >
              Suscribirme ahora
            </button>

            <span className="text-xs text-white/60">
              Cancela cuando quieras
            </span>
          </div>
        </section>
      )}

      {/* ================= INGREDIENTES (NO PREMIUM) ================= */}
      {!isPremium && (
        <section className="mb-6 bg-[#2a221b] rounded-xl p-5 border border-white/10">
          <h2 className="text-lg font-semibold mb-3 text-white">
            Ingredientes
          </h2>
          <p className="text-white/80 whitespace-pre-line">
            {recipe.ingredients}
          </p>
        </section>
      )}

      {/* ================= PREPARACIÓN ================= */}
      {!isPremium && isEasy && (
        // ✅ FÁCIL: COMPLETA
        <section className="bg-[#2a221b] rounded-xl p-5 border border-white/10">
          <h2 className="text-lg font-semibold mb-3 text-white">
            Pasos de preparación
          </h2>
          <p className="text-white/80 whitespace-pre-line">
            {recipe.description}
          </p>
        </section>
      )}

      {!isPremium && isMediumOrHard && (
        // 🔒 MEDIA / DIFÍCIL: BLOQUEADA + REGISTRO
        <section className="bg-[#2a221b] rounded-xl p-5 border border-white/10 relative">
          <h2 className="text-lg font-semibold mb-3 text-white">
            Pasos de preparación
          </h2>

          <p className="text-white/80 whitespace-pre-line blur-sm select-none">
            {recipe.description}
          </p>

          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center rounded-xl gap-3 p-4">
            <span className="text-white text-sm text-center">
              🔒 Disponible solo para usuarios registrados
            </span>

            <button
              onClick={() => router.push("/register")}
              className="px-4 py-2 rounded-lg bg-[#FFF3E0] text-[#F57C00] text-sm font-semibold border border-[#F57C00]/50 hover:scale-105 transition"
            >
              Regístrate gratis
            </button>
          </div>
        </section>
      )}
    </div>
  );
}