"use client";

import { ArrowLeft, BarChart3, Crown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react"


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


  /* ================= INGREDIENTES COMO LISTA ================= */
  const ingredientsList = recipe.ingredients
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  /* ================= CATEGORÍAS → FONDO ================= */
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
      {showBackButton && (
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 mb-6 transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          {backLabel}
        </button>
      )}

      {/* ===== IMAGEN HERO ===== */}
      <div className="w-full h-105 mb-8 flex items-center justify-center">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="max-w-full max-h-full object-contain rounded-2xl shadow-lg"
        />
      </div>

      {/* ===== HEADER ===== */}
      <div className="mb-10 text-center">
        <div className="flex justify-center mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-[#F57C00]">
            {recipe.title}
          </h1>
        </div>

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

      {/* ===== GRID ===== */}

      
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
    </div>
  );
}