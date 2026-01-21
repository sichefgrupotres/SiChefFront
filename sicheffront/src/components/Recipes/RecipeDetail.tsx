

"use client";

import { ArrowLeft, BarChart3, Crown, PlayCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string;
  difficulty: "facil" | "medio" | "dificil";
  imageUrl: string;
  isPremium: boolean;
  category?: string[] | string;
}

interface Props {
  recipe: Recipe;
  showBackButton?: boolean;
  backLabel?: string;
}

export default function RecipeDetail({
  recipe,
  showBackButton = true,
  backLabel = "Volver",
}: Props) {
  const router = useRouter();

  // ===== STATES =====
  const [activeTab, setActiveTab] = useState<"detail" | "tutorial">("detail");
  const [tutorial, setTutorial] = useState<any>(null);
  const [loadingTutorial, setLoadingTutorial] = useState(false);
  const [tutorialError, setTutorialError] = useState(false);
  const { dataUser, isLoadingUser } = useAuth();

  useEffect(() => {
  console.log("DATA USER SESSION 👉", dataUser);
}, [dataUser]);

  // ===== FETCH TUTORIAL =====
  useEffect(() => {
    if (activeTab !== "tutorial") return;

    setLoadingTutorial(true);
    setTutorialError(false);

    fetch(`http://localhost:3001/tutorials/by-recipe/${recipe.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("No encontrado");
        return res.json();
      })
      .then((data) => {
        setTutorial(data);
        setLoadingTutorial(false);
      })
      .catch(() => {
        setTutorialError(true);
        setLoadingTutorial(false);
      });
  }, [activeTab, recipe.id]);

  // ===== INGREDIENTES =====

  const ingredientsList = recipe.ingredients
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  // ===== CATEGORÍAS =====
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
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between mb-6">
        {/* VOLVER */}
        <div>
          {showBackButton && (
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 transition cursor-pointer"
            >
              <ArrowLeft size={16} />
              {backLabel}
            </button>
          )}
        </div>

        {/* TABS */}
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("detail")}
            className={`pb-2 font-semibold transition cursor-pointer
              ${
                activeTab === "detail"
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-400 hover:text-white"
              }`}
          >
            Detalle receta
          </button>

          <button
            onClick={() => setActiveTab("tutorial")}
            className={`flex items-center gap-2 pb-2 font-semibold transition cursor-pointer
        ${
          activeTab === "tutorial"
            ? "text-orange-500 border-b-2 border-orange-500"
            : "text-gray-400 hover:text-white"
        }`}
          >
            <PlayCircle size={16} />
            Ver tutorial
          </button>
        </div>
      </div>

      {/* ===== IMAGEN ===== */}
      <div className="w-full h-105 mb-8 flex items-center justify-center">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="max-w-full max-h-full object-contain rounded-2xl shadow-lg"
        />
      </div>

      {/* ===== TÍTULO ===== */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#F57C00] mb-2">
          {recipe.title}
        </h1>

        <div className="flex justify-center items-center gap-4 text-white/70">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} />
            <span className="capitalize">{recipe.difficulty}</span>
          </div>

          {recipe.isPremium && (
            <span className="flex items-center gap-1 text-xs bg-[#F57C00] px-3 py-1 rounded-full text-white">
              <Crown size={14} />
              Premium
            </span>
          )}
        </div>
      </div>

      {/* ===== CONTENIDO ===== */}
      {activeTab === "detail" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* INGREDIENTES */}
          <section className="relative rounded-xl overflow-hidden border border-white/10">
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
          <section className="bg-[#2a221b] rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4 text-[#F57C00]">
              Preparación
            </h2>
            <p className="text-white/80 whitespace-pre-line leading-relaxed">
              {recipe.description}
            </p>
          </section>
        </div>
      )}

      {/* ===== TUTORIAL ===== */}
      {activeTab === "tutorial" && (
        <div className="w-full flex justify-center">
          {loadingTutorial && (
            <p className="text-white/70">Cargando tutorial...</p>
          )}

          {tutorialError && (
            <p className="text-white/70">No hay tutorial para esta receta</p>
          )}

          {tutorial && (
            <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
              <div className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden">
                <button
                  onClick={() => setActiveTab("detail")}
                  aria-label="Cerrar"
                  className="
                  flex items-center justify-center
                  h-10 w-10
                  rounded-full
                  bg-black/60 backdrop-blur-sm
                  text-white
                  shadow-lg
                  transition
                  duration-150
                  ease-out
                  hover:bg-black/80
                  hover:scale-105
                  hover:shadow-xl
                  cursor-pointer
                  absolute top-4 right-4 z-50
"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="aspect-video">
                  <video
                    src={tutorial.videoUrl}
                    controls
                    preload="metadata"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
