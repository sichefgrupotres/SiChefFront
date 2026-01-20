"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import RecipeCard from "@/components/Recipes/CardRecipe";
import MyTutorialsList from "@/components/Tutorials/MyTutorialsList";
import { useTutorial } from "@/context/TutorialContext";
import { useSession } from "next-auth/react";
// 👈 Lo comentamos por ahora para usar la lógica local con token

export default function CreatorHomePage() {
  const { fetchMyTutorials } = useTutorial();

  // 👇 2. Estados locales para manejar la data con el token
  const { data: session } = useSession();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ================= ESTADOS FILTROS =================
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "none">("none");
  const [activeTab, setActiveTab] = useState<"recipes" | "tutorials">(
    "recipes",
  );

  useEffect(() => {
    if (activeTab === "tutorials") {
      fetchMyTutorials();
    }
  }, [activeTab, fetchMyTutorials]);
  // ================= EFFECT =================
  // ================= EFFECT =================
  useEffect(() => {
    const fetchRecipesWithToken = async () => {
      setLoading(true);
      try {
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        // 👇 MEJORA ROBUSTA: Buscamos el token en ambos lugares
        const sessionData = session as any;
        const userData = session?.user as any;

        // Si existe en user.backendToken O en session.backendToken
        const token = userData?.backendToken || sessionData?.backendToken;

        if (token) {
          // console.log("🟢 Token encontrado en Home, enviando..."); // Descomenta si quieres depurar
          headers["Authorization"] = `Bearer ${token}`;
        } else {
          // console.log("🟠 No hay token, cargando como invitado");
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
          headers: headers,
        });

        if (!res.ok) throw new Error("Error al cargar recetas");

        const data = await res.json();
        setRecipes(data.data || []);

      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipesWithToken();
  }, [session]); // Se ejecuta cada vez que la sesión cambia (ej. al loguearse)

  // ================= BUSCADOR =================
  const handleSearch = () => {
    setSearchTerm(searchTerm.trim());
  };

  // ================= FILTRADO =================
  const filteredRecipes = (recipes ?? [])
    .filter((recipe) => {
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
    // ================= ORDEN ALFABÉTICO =================
    .sort((a, b) => {
      if (sortOrder !== "asc") return 0;
      return a.title.localeCompare(b.title, "es", {
        sensitivity: "base",
      });
    });

  // ================= ESTADOS UI =================
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

  // ================= CATEGORÍAS =================
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
      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto w-full grow">
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
          <div className="flex w-full max-w-2xl shadow-lg rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-orange-500">
            <div className="flex items-center gap-2 w-full px-4 py-3 bg-white">
              <span className="material-symbols-outlined text-gray-400">
                search
              </span>
              <input
                type="text"
                placeholder="¿Qué se te antoja hoy?"
                className="w-full outline-none text-base text-gray-700 placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
            </div>

            <button
              onClick={handleSearch}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 font-bold transition-colors"
            >
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
                  min-w-35
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
                <span className="relative z-10 text-white">{cat.name}</span>
              </button >
            ))
            }
          </div >
        </section >

        {/* ================= TABS ================= */}
        <section className="px-4 md:px-8 pb-8 flex gap-6 border-b border-white/10" >
          <button
            onClick={() => setActiveTab("recipes")}
            className={`pb-3 font-semibold transition cursor-pointer
              ${activeTab === "recipes"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-400 hover:text-white"
              }`}
          >
            Mis Recetas
          </button>

          <button
            onClick={() => setActiveTab("tutorials")}
            className={`pb-3 font-semibold transition cursor-pointer
              ${activeTab === "tutorials"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-400 hover:text-white"
              }`}
          >
            Mis Tutoriales
          </button>
        </section>

        {/* ================= GRID DE RECETAS / LISTA DE TUTORIALES ================= */}
        < section className="px-4 md:px-8 py-16 bg-[#181411]" >
          {activeTab === "recipes" &&
            (filteredRecipes.length === 0 ? (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} mode="creator" />
                ))}
              </div>
            ))}

          {activeTab === "tutorials" && <MyTutorialsList />}
        </section >
      </main >

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8 text-center text-sm text-gray-500 " >
        <p>© 2025 SiChef! · Cocinando con amor 🧡</p>
      </footer >
    </div >
  )
};
