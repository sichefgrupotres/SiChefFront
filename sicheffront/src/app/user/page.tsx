"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import RecipeCard from "@/components/Recipes/CardRecipe";
import { useRecipe } from "@/context/RecipeContext";
import { Crown } from "lucide-react";

export default function CreatorHomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { recipes, fetchRecipes, loading, error } = useRecipe();

  // ================= ESTADOS =================
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "none">("none");

  // ================= EFFECT =================
  useEffect(() => {
    fetchRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ================= BUSCADOR =================
  const handleSearch = () => {
    setSearchTerm(searchTerm.trim());
  };

  // ================= FILTRADO =================
  const filteredRecipes = (recipes ?? [])
    .filter((recipe) => {
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

      const matchesCategory =
        selectedCategory === "Todas" ||
        categoriesArray.includes(selectedCategory);

      const title = recipe.title?.toLowerCase() ?? "";
      const ingredients = recipe.ingredients?.toLowerCase() ?? "";
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        title.includes(search) || ingredients.includes(search);

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOrder !== "asc") return 0;
      return a.title.localeCompare(b.title, "es", { sensitivity: "base" });
    });

  // ================= UI STATES =================
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

  // ================= CATEGORÍAS =================
  const categoriesList = [
    { name: "Todas", image: "/categories/todas.jpg" },
    { name: "Desayunos", image: "/categories/desayuno.jpg" },
    { name: "Almuerzos", image: "/categories/almuerzo.jpg" },
    { name: "Meriendas", image: "/categories/merienda.jpg" },
    { name: "Cenas", image: "/categories/cena.jpg" },
    { name: "Postres", image: "/categories/postres.jpg" },
  ];

  // ================= CONDICIÓN CTA =================
  const showSubscriptionCTA =
    status === "authenticated" && session.user.role !== "SUSCRIPTOR";

  return (
    <div className="min-h-screen flex flex-col">
      <main className="max-w-7xl mx-auto w-full grow">
        {/* ================= HEADER ================= */}
        <section className="px-4 md:px-8 py-16 flex flex-col items-center gap-8 text-center">
          <div className="flex items-center gap-4">
            <Image
              src="/Logo.png"
              alt="Logo Si Chef"
              width={150}
              height={150}
              className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover shadow-lg border-2 border-orange-500"
              priority
            />
            <h1 className="text-[#F57C00] text-4xl md:text-6xl font-extrabold">
              Si Chef!
            </h1>
          </div>

          {/* ================= BUSCADOR ================= */}
          <div className="flex w-full max-w-2xl shadow-lg rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 w-full px-4 py-3 bg-white">
              <span className="material-symbols-outlined text-gray-400">
                search
              </span>
              <input
                type="text"
                placeholder="¿Qué se te antoja hoy?"
                className="w-full outline-none text-base text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 font-bold"
            >
              Buscar
            </button>
          </div>

          {/* ================= CTA SUSCRIPCIÓN ================= */}
          {showSubscriptionCTA && (
            <div className="mt-10 w-full max-w-2xl mx-auto">
              <div
                className="
        relative
        overflow-hidden
        rounded-2xl
        border
        border-orange-500/30
        bg-gradient-to-br
        from-orange-500/10
        via-[#181411]
        to-transparent
        p-6
        backdrop-blur
        shadow-lg
      "
              >
                {/* Glow sutil */}
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  {/* TEXTO */}
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/20 text-orange-400">
                      <Crown size={20} />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white">
                        Desbloquea la experiencia Premium
                      </h3>
                      <p className="text-sm text-white/70 mt-1 max-w-md">
                        Accede a recetas exclusivas, preparaciones completas y
                        contenido creado por chefs profesionales.
                      </p>
                    </div>
                  </div>

                  {/* BOTÓN */}
                  <button
                    onClick={() => router.push("/subscription")}
                    className="
            shrink-0
            flex
            items-center
            gap-2
            px-6
            py-3
            rounded-full
            bg-orange-500
            text-white
            font-bold
            text-sm
            hover:bg-orange-600
            transition-all
            shadow-md
            active:scale-95
          "
                  >
                    <Crown size={16} />
                    Hacete Premium
                  </button>
                </div>

                {/* Micro copy */}
                <p className="relative z-10 text-xs text-white/50 mt-4">
                  Cancela cuando quieras · Sin compromisos
                </p>
              </div>
            </div>
          )}
        </section>

        {/* ================= CATEGORÍAS ================= */}
        <section className="px-4 md:px-8 pb-8">
          <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-orange-500 pl-3">
            Explorar Categorías
          </h2>

          <div className="flex gap-3 overflow-x-auto pb-4">
            {categoriesList.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                style={{ backgroundImage: `url(${cat.image})` }}
                className={`relative bg-cover bg-center min-w-35 h-24 rounded-xl font-bold
                  after:absolute after:inset-0 after:bg-black/50
                  ${selectedCategory === cat.name ? "ring-2 ring-orange-500" : ""}`}
              >
                <span className="relative z-10">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ================= RECETAS ================= */}
        <section className="px-4 md:px-8 pb-16">
          <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-orange-500 pl-3">
            Explorar Recetas
          </h2>

          {filteredRecipes.length === 0 ? (
            <div className="text-center text-gray-400 py-20">
              No encontramos recetas
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} mode="user" />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-gray-500">
        © 2025 SiChef! · Cocinando con amor 🧡
      </footer>
    </div>
  );
}
