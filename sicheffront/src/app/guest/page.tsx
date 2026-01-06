"use client";

import { PATHROUTES } from "@/utils/PathRoutes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import RecipeCard from "@/components/CardRecipe";
import { useRecipe } from "@/context/RecipeContext";
import MyRecipesList from "@/components/MyRecipesList";

export default function GuestHomePage() {
  const { recipes, fetchRecipes, loading, error } = useRecipe();

  const [selectedCategory, setSelectedCategory] = useState("Todas");

  useEffect(() => {
    fetchRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categoriesList = [
    { name: "Todas", image: "/categories/todas.jpg" },
    { name: "Desayunos", image: "/categories/desayuno.jpg" },
    { name: "Almuerzos", image: "/categories/almuerzo.jpg" },
    { name: "Meriendas", image: "/categories/merienda.jpg" },
    { name: "Cenas", image: "/categories/cena.jpg" },
    { name: "Postres", image: "/categories/postres.jpg" },
  ];

  const filteredRecipes =
    selectedCategory === "Todas"
      ? recipes
      : recipes.filter((recipe) => {
        let categoriesArray: string[] = [];

        if (Array.isArray(recipe.categories)) {
          categoriesArray = recipe.categories;
        } else if (typeof recipe.categories === "string") {
          try {
            const parsed = JSON.parse(recipe.categories);
            categoriesArray = Array.isArray(parsed) ? parsed : [parsed];
          } catch {
            categoriesArray = [recipe.categories];
          }
        }

        return categoriesArray.includes(selectedCategory);
      });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Cargando recetas...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* ================= HEADER ================= */}
      <header className="w-full">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-end items-center gap-4">
          <Link href={PATHROUTES.LOGIN}>
            <button className="px-5 py-2 rounded-full border border-gray-300 text-sm font-medium text-white hover:bg-gray-50 hover:text-black transition-all">
              Iniciar sesión
            </button>
          </Link>

          <Link href={PATHROUTES.REGISTER}>
            <button className="px-5 py-2 rounded-full bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-all shadow-sm hover:shadow-md flex items-center gap-1.5">
              <span className="text-xl leading-none mb-0.5">+</span>
              Crear una receta
            </button>
          </Link>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto">
        {/* ================= HERO ================= */}
        <section className="px-4 md:px-8 py-16 flex flex-col items-center gap-8 text-center">
          <div className="flex items-center gap-4">
            <Image
              src="/Logo.png"
              alt="Logo Si Chef"
              width={150}
              height={150}
              className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover"
            />
            <h1 className="text-[#F57C00] text-4xl md:text-6xl font-bold">
              Si Chef!
            </h1>
          </div>

          {/* Buscador */}
          <div className="flex w-full max-w-2xl">
            <div className="flex items-center gap-2 w-full border border-gray-300 rounded-l-xl px-4 py-3 bg-white">
              <span className="material-symbols-outlined text-gray-400">
                search
              </span>
              <input
                type="text"
                placeholder="Busca por receta o ingredientes"
                className="w-full outline-none text-sm text-black"
              />
            </div>

            <button className="bg-orange-500 text-white px-8 rounded-r-xl text-sm font-semibold cursor-pointer">
              Buscar
            </button>
          </div>
        </section>

        {/* ================= CATEGORIES (ACTUALIZADAS) ================= */}
        <section className="px-4 md:px-8 pb-15">
          <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-orange-500 pl-3 pb-4">
            Explorar Categorias
          </h2>

          <div className="flex gap-6 overflow-x-auto pb-2 pt-2 pl-2">
            {categoriesList.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                style={{ backgroundImage: `url(${cat.image})` }}
                className={`
                  relative overflow-hidden bg-cover bg-center
                  min-w-[140px] h-24 rounded-xl
                  flex items-center justify-center
                  font-bold text-white
                  transition-transform hover:scale-105

                  after:absolute after:inset-0 after:bg-black/50 after:content-['']

                  ${selectedCategory === cat.name
                    ? "ring-2 ring-orange-500"
                    : ""
                  }
                `}
              >
                <span className="relative z-10">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ================= RECIPES GRID (REAL) ================= */}
        <section className="px-4 md:px-8 pb-15">
          <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-orange-500 pl-3">
            Tendencias semanales
          </h2>
          <MyRecipesList />

        </section>
      </main>

      <footer className="border-gray-200 dark:border-white/10 py-10 text-center text-sm text-gray-500">
        © 2025 SiChef! · Todos los derechos reservados
      </footer>
    </div>
  );
}
