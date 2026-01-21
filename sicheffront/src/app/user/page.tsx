"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import RecipeCard from "@/components/Recipes/CardRecipe";
// Mantenemos useRecipe por si usas otras cosas del contexto, pero no para el fetch inicial
import { useRecipe } from "@/context/RecipeContext";
import { Crown } from "lucide-react";

export default function UserHomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  

  // Usamos estados locales para tener control total de los datos con Token
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ================= ESTADOS FILTROS =================
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "none">("none");

  // Verificar Premium
  const isPremium = session?.user?.role === "PREMIUM"

  // ================= EFFECT: CARGAR RECETAS CON TOKEN =================
  useEffect(() => {
    const fetchRecipesWithToken = async () => {
      setLoading(true);
      try {
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        // 👇 LA CLAVE: Buscamos el token donde sea que esté
        const sessionData = session as any;
        const userData = session?.user as any;
        const token = userData?.backendToken || sessionData?.backendToken;

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
          headers: headers,
        });

        if (!res.ok) throw new Error("Error al cargar recetas");

        const data = await res.json();
        // El backend devuelve paginado { data: [], meta: {} } o directo []
        const recipesData = data.data || data || [];

        setRecipes(recipesData);

      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Ejecutamos siempre, pero si hay sesión, esperará a tener el token
    if (status === "loading") return;
    fetchRecipesWithToken();

  }, [session, status]);

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
      <div className="min-h-screen flex items-center justify-center text-white bg-[#181411]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#F57C00] border-t-transparent rounded-full animate-spin"></div>
          <p className="animate-pulse">Cargando recetas deliciosas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 bg-[#181411]">
        Error: {error}
      </div>
    );
  }

  const categoriesList = [
    { name: "Todas", image: "/categories/todas.jpg" },
    { name: "Desayunos", image: "/categories/desayuno.jpg" },
    { name: "Almuerzos", image: "/categories/almuerzo.jpg" },
    { name: "Meriendas", image: "/categories/merienda.jpg" },
    { name: "Cenas", image: "/categories/cena.jpg" },
    { name: "Postres", image: "/categories/postres.jpg" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#181411]">
      <main className="max-w-7xl mx-auto w-full grow">
        {/* HEADER */}
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
            <h1 className="text-[#F57C00] text-4xl md:text-6xl font-extrabold tracking-tight">
              Si Chef!
            </h1>
          </div>

          {/* BUSCADOR */}
          <div className="flex w-full max-w-2xl shadow-lg rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-orange-500">
            <div className="flex items-center gap-2 w-full px-4 py-3 bg-white">
              <span className="material-symbols-outlined text-gray-400">search</span>
              <input
                type="text"
                placeholder="¿Qué se te antoja hoy?"
                className="w-full outline-none text-base text-gray-700 placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 font-bold transition-colors"
            >
              Buscar
            </button>
          </div>

          {/* CTA PREMIUM (Solo si no es premium) */}
          {!isPremium && status === "authenticated" && (
            <div className="mt-10 w-full max-w-2xl mx-auto">
              <div className="relative overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-[#181411] to-transparent p-6 backdrop-blur shadow-lg">
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl" />
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-start gap-4 text-left">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 shrink-0">
                      <Crown size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Experiencia Premium</h3>
                      <p className="text-sm text-white/70 mt-1 max-w-md">
                        Favoritos ilimitados y acceso a recetas exclusivas.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push("/subscription")}
                    className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-full bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Crown size={16} /> Hacete Premium
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* CATEGORÍAS */}
        <section className="px-4 md:px-8 pb-8">
          <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-orange-500 pl-3">
            Explorar Categorías
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-4 pt-2 pl-1 scrollbar-hide ">
            {categoriesList.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                style={{ backgroundImage: `url(${cat.image})` }}
                className={` cursor-pointer relative bg-cover bg-center min-w-32 h-24 rounded-xl font-bold flex items-center justify-center
                  after:absolute after:inset-0 after:bg-black/50 after:rounded-xl
                  ${selectedCategory === cat.name ? "ring-2 ring-orange-500" : ""}`}
              >
                <span className="relative z-10 text-white shadow-black drop-shadow-md">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* LISTA DE RECETAS */}
        <section className="px-4 md:px-8 pb-16">
          <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-orange-500 pl-3">
            Explorar Recetas
          </h2>

          {filteredRecipes.length === 0 ? (
            <div className="text-center text-gray-400 py-20 flex flex-col items-center">
              <span className="text-4xl mb-2">🍽️</span>
              <p>No encontramos recetas con esos filtros.</p>
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