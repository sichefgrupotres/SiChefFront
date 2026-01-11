"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { ArrowLeft, BarChart3, Crown } from "lucide-react";

interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string;
  difficulty: "facil" | "medio" | "dificil";
  imageUrl: string;
  isPremium: boolean;
  category?: string[] | string;
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
        const res = await fetch(`http://localhost:3001/posts/${id}`);
        if (!res.ok) throw new Error();
        setRecipe(await res.json());
      } catch {
        Swal.fire("Error", "No se pudo cargar la receta", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-96 text-white">
        Cargando receta...
      </div>
    );

  if (!recipe) return null;

  const isPremium = recipe.isPremium;
  const isEasy = recipe.difficulty === "facil";
  const isMediumOrHard =
    recipe.difficulty === "medio" || recipe.difficulty === "dificil";

  // ================= INGREDIENTES COMO LISTA =================
  const ingredientsList = recipe.ingredients
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  // ================= CATEGORÍAS =================
  const categoryImages: Record<string, string> = {
    Desayunos: "/categories/desayuno.jpg",
    Almuerzos: "/categories/almuerzo.jpg",
    Meriendas: "/categories/merienda.jpg",
    Cenas: "/categories/cena.jpg",
    Postres: "/categories/postres.jpg",
  };

  // Normalizar categorías
  let categoriesArray: string[] = [];

  if (Array.isArray(recipe.category)) {
    categoriesArray = recipe.category;
  } else if (typeof recipe.category === "string") {
    try {
      const parsed = JSON.parse(recipe.category);
      categoriesArray = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      categoriesArray = [recipe.category];
    }
  }

  const mainCategory = categoriesArray[0];
  const backgroundImage = categoryImages[mainCategory] || recipe.imageUrl;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* ===== VOLVER ===== */}
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 mb-6 transition"
      >
        <ArrowLeft size={16} />
        Volver a recetas
      </button>

      {/* ===== IMAGEN HERO ===== */}
      <div className="w-full h-[420px] mb-8 flex items-center justify-center">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="max-w-full max-h-full object-contain rounded-2xl shadow-lg"
        />
      </div>

      {/* ===== HEADER ===== */}
      <div className="mb-10">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {recipe.title}
          </h1>

          {isPremium && (
            <span className="flex items-center gap-1 text-sm bg-[#F57C00] px-3 py-1 rounded-full text-white">
              <Crown size={14} />
              Premium
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-white/70">
          <BarChart3 size={16} />
          <span className="capitalize">{recipe.difficulty}</span>
        </div>
      </div>

      {/* ===== GRID ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* ================= INGREDIENTES ================= */}
        {!isPremium && (
          <section className="relative rounded-xl overflow-hidden border border-white/10">
            {/* Imagen de fondo por categoría */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/70" />

            {/* Contenido */}
            <div className="relative z-10 p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Ingredientes
              </h2>

              <ul className="space-y-2 text-white/90">
                {ingredientsList.map((ingredient, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-[#F57C00] font-bold">•</span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ================= PREPARACIÓN ================= */}
        {!isPremium && isEasy && (
          <section className="bg-[#2a221b] rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Preparación
            </h2>
            <p className="text-white/80 whitespace-pre-line">
              {recipe.description}
            </p>
          </section>
        )}

        {!isPremium && isMediumOrHard && (
          <section className="bg-[#2a221b] rounded-xl p-6 border border-white/10 relative">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Preparación
            </h2>

            <p className="text-white/80 whitespace-pre-line blur-sm select-none">
              {recipe.description}
            </p>

            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-4 rounded-xl">
              <span className="text-white text-sm text-center">
                🔒 Disponible solo para usuarios registrados
              </span>
              <button
                onClick={() => router.push("/register")}
                className="px-5 py-2 rounded-lg bg-[#FFF3E0] text-[#F57C00] font-semibold hover:scale-105 transition"
              >
                Regístrate gratis
              </button>
            </div>
          </section>
        )}

        {/* ================= CTA PREMIUM ================= */}
        {isPremium && (
          <section className="md:col-span-2 bg-[#2a221b] rounded-xl p-10 border border-[#F57C00]/40 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent" />

            <div className="relative z-10 flex flex-col items-center gap-4">
              <Crown size={32} className="text-[#F57C00]" />

              <h2 className="text-2xl font-bold text-white">
                Desbloquea esta receta premium 🍽️
              </h2>

              <p className="text-white/80 max-w-xl">
                Accede a ingredientes completos, preparación detallada y a todas
                nuestras recetas exclusivas.
              </p>

              <button
                onClick={() => router.push("/subscription")}
                className="px-8 py-3 rounded-full bg-[#F57C00] text-white font-semibold hover:bg-orange-600 transition shadow-lg"
              >
                Suscribirme ahora
              </button>

              <span className="text-xs text-white/60">
                Cancela cuando quieras
              </span>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
