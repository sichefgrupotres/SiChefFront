"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { ArrowLeft, BarChart3, Crown } from "lucide-react";
// 1. Importamos el contexto de autenticación
import { useAuth } from "@/context/AuthContext";

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

  // 2. Obtenemos la información del usuario logueado
  const { dataUser, isLoadingUser } = useAuth();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  // Carga de la receta
  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`);
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

  // Pantalla de carga (esperamos receta Y usuario)
  if (loading || isLoadingUser)
    return (
      <div className="flex justify-center items-center h-96 text-white">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p>Cargando receta...</p>
        </div>
      </div>
    );

  if (!recipe) return null;

  // 3. LÓGICA DE PERMISOS (Aquí estaba el error antes)
  const user = dataUser?.user as any;

  // Verificamos si el usuario tiene privilegios (Premium, Admin o Creador)
  const iAmPremium =
    !!user?.isPremium ||
    user?.role === "PREMIUM" ||
    user?.role === "ADMIN" ||
    user?.role === "CREATOR";

  // ¿Debemos bloquear el contenido?
  // SOLO bloqueamos si la receta es Premium Y el usuario NO tiene privilegios
  const isContentLocked = recipe.isPremium && !iAmPremium;

  // ================= INGREDIENTES =================
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
        onClick={() => router.push("/user")}
        className="flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 mb-6 transition"
      >
        <ArrowLeft size={16} />
        Volver a recetas
      </button>

      {/* ===== HERO IMAGE ===== */}
      <div className="w-full h-[420px] mb-8 flex items-center justify-center bg-[#2a221b] rounded-2xl overflow-hidden">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* ===== HEADER ===== */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#F57C00]">
          {recipe.title}
        </h1>
        <div className="flex justify-center items-center gap-4 text-white/70 mt-2">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} />
            <span className="capitalize">{recipe.difficulty}</span>
          </div>
          {recipe.isPremium && (
            <span className="flex items-center gap-1 text-sm bg-[#F57C00] px-3 py-1 rounded-full text-white">
              <Crown size={14} />
              Premium
            </span>
          )}
        </div>
      </div>

      {/* ===== GRID DE CONTENIDO ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* CASO 1: CONTENIDO DESBLOQUEADO (Se muestra si !isContentLocked) */}
        {!isContentLocked && (
          <>
            {/* INGREDIENTES */}
            <section className="relative rounded-xl overflow-hidden border border-white/10 h-fit">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${backgroundImage})` }}
              />
              <div className="absolute inset-0 bg-black/70" />
              <div className="relative z-10 p-6">
                <h2 className="text-xl font-semibold mb-4 text-[#F57C00]">
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

            {/* PREPARACIÓN */}
            <section className="bg-[#2a221b] rounded-xl p-6 border border-white/10 h-fit">
              <h2 className="text-xl font-semibold mb-4 text-[#F57C00]">
                Preparación
              </h2>
              <p className="text-white/80 whitespace-pre-line leading-relaxed">
                {recipe.description}
              </p>
            </section>
          </>
        )}

        {/* CASO 2: CONTENIDO BLOQUEADO (Se muestra si isContentLocked) */}
        {isContentLocked && (
          <section className="md:col-span-2 bg-[#2a221b] rounded-xl p-12 border border-[#F57C00]/40 text-center relative overflow-hidden shadow-2xl">
            {/* Fondo con gradiente sutil */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent" />

            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="bg-[#F57C00]/20 p-4 rounded-full">
                <Crown size={48} className="text-[#F57C00]" />
              </div>

              <h2 className="text-3xl font-bold text-white">
                Receta Exclusiva Premium 🍽️
              </h2>

              <p className="text-gray-300 max-w-xl text-lg leading-relaxed">
                Los ingredientes secretos y el paso a paso detallado de esta receta están reservados para nuestros miembros.
                <br />
                <strong>¡Suscríbete ahora para desbloquear todo el contenido!</strong>
              </p>

              <button
                onClick={() => router.push("/subscription")}
                className="px-10 py-4 rounded-xl bg-[#F57C00] text-white font-bold text-lg hover:bg-orange-600 transition shadow-lg hover:shadow-orange-500/20 active:scale-95"
              >
                Hacerme Premium
              </button>

              <span className="text-sm text-white/50">
                Cancela tu suscripción cuando quieras.
              </span>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}