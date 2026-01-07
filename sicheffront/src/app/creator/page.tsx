"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import RecipeCard from "@/components/CardRecipe";
import { useRecipe } from "@/context/RecipeContext";

export default function GuestHomePage() {
  // 1. Contexto: Traemos las recetas y funciones del backend
  const { recipes, fetchRecipes, loading, error } = useRecipe();

  // 2. Estados Locales: Para controlar qué está escribiendo o seleccionando el usuario
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // 3. Effect: Carga las recetas al entrar a la página
  useEffect(() => {
    fetchRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================================================
  // 4. MOTOR DE FILTRADO (La parte más importante)
  // =========================================================
  const filteredRecipes = recipes.filter((recipe) => {
    // PASO A: Normalizar Categorías (Blindaje contra errores de datos)
    // Si la receta no tiene categorías (undefined), usamos un array vacío [] para que no explote.
    let categoriesArray: string[] = [];

    if (Array.isArray(recipe.category)) {
      categoriesArray = recipe.category;
    } else if (typeof recipe.category === "string") {
      // Si viene como texto "['Cenas']", intentamos convertirlo a lista real
      try {
        const parsed = JSON.parse(recipe.category);
        categoriesArray = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        // Si es texto simple "Cenas", lo guardamos en una lista
        categoriesArray = [recipe.category];
      }
    }

    // PASO B: Filtro por Categoría
    // Si elegiste "Todas", pasa. Si no, revisamos si la lista de categorías incluye la seleccionada.
    const matchesCategory =
      selectedCategory === "Todas" ||
      categoriesArray.includes(selectedCategory);

    // PASO C: Filtro por Buscador (Título o Ingredientes)
    // Usamos ?. para asegurar que existan antes de pasar a minúsculas
    const title = recipe.title ? recipe.title.toLowerCase() : "";
    const ingredients = recipe.ingredients
      ? recipe.ingredients.toLowerCase()
      : "";
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      title.includes(search) || ingredients.includes(search);

    // La receta se muestra solo si cumple AMBAS condiciones
    return matchesCategory && matchesSearch;
  });

  // 5. Manejo de Carga y Errores
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="animate-pulse">Cargando recetas deliciosas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Error: {error}
      </div>
    );
  }

  // Lista de categorías para generar los botones
  const categoriesList = [
    { name: "Todas", image: "/categories/todas.jpg" },
    { name: "desayunos", image: "/categories/desayuno.jpg" },
    { name: "almuerzos", image: "/categories/almuerzo.jpg" },
    { name: "meriendas", image: "/categories/merienda.jpg" },
    { name: "cenas", image: "/categories/cena.jpg" },
    { name: "postres", image: "/categories/postres.jpg" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto w-full flex-grow">
        {/* ================= HEADER & SEARCH ================= */}
        <section className="px-4 md:px-8 py-16 flex flex-col items-center gap-8 text-center">
          <div className="flex items-center gap-4 animate-fade-in-down">
            <Image
              src="/Logo.png"
              alt="Logo Si Chef"
              width={150}
              height={150}
              className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover shadow-lg border-2 border-orange-500"
              priority
            />
            <h1 className="text-[#F57C00] text-4xl md:text-6xl font-extrabold tracking-tight">
              Si Chef!
            </h1>
          </div>

          {/* Buscador Interactivo */}
          <div className="flex w-full max-w-2xl shadow-lg rounded-xl overflow-hidden transition-all focus-within:ring-2 focus-within:ring-orange-500">
            <div className="flex items-center gap-2 w-full border-none px-4 py-3 bg-white">
              <span className="material-symbols-outlined text-gray-400">
                search
              </span>
              <input
                type="text"
                placeholder="¿Qué se te antoja hoy?"
                className="w-full outline-none text-base text-gray-700 placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 font-bold transition-colors">
              Buscar
            </button>
          </div>
        </section>

        {/* ================= CATEGORIES ================= */}
        <section className="px-4 md:px-8 pb-8">
          <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-orange-500 pl-3">
            Explorar Categorías
          </h2>

          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide pl-2 pt-2">
            {categoriesList.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                style={{ backgroundImage: `url(${cat.image})` }}
                className={`
    relative
    overflow-hidden
    bg-cover
    bg-center
    min-w-[140px]
    h-24
    rounded-xl
    flex
    items-center
    justify-center
    font-bold
    text-lg
    transition-all
    transform
    hover:scale-105
    cursor-pointer

    after:absolute
    after:inset-0
    after:bg-black/50
    after:content-['']

    ${selectedCategory === cat.name
                    ? "ring-2 ring-orange-500"
                    : ""
                  }
  `}
              >
                {/* Texto (igual que antes) */}
                <span className="relative z-10">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ================= GRID DE RECETAS ================= */}
        <section className="px-4 md:px-8 pb-15">
          <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-orange-500 pl-3">
            Explorar Recetas
          </h2>
          {filteredRecipes.length === 0 ? (
            // Mensaje Estado Vacío
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-80">
              <span className="text-6xl mb-4">🍽️</span>
              <h3 className="text-xl text-white font-semibold">
                No encontramos recetas
              </h3>
              <p className="text-gray-400 mt-2 max-w-md">
                No hay resultados para "{searchTerm}" en la categoría "
                {selectedCategory}".
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("Todas");
                }}
                className="mt-6 text-orange-500 hover:text-orange-400 underline font-semibold"
              >
                Limpiar filtros y ver todo
              </button>
            </div>
          ) : (
            // Grilla Responsive
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8 text-center text-sm text-gray-500 ">
        <p>© 2025 SiChef! · Cocinando con amor 🧡</p>
      </footer>
    </div>
  );
}
