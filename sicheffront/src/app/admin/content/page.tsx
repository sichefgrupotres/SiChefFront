"use client";

import { useEffect, useState } from "react";
import RecipeCard from "@/components/Recipes/CardRecipe";
import { useRecipe } from "@/context/RecipeContext";
import { adminService } from "@/services/admin.services";
import { useSession } from "next-auth/react";
import TutorialCard from "@/components/admin/content/TutorialCard";

interface Tutorial {
  id: string;
  title: string;
  author: string;
  category: string;
}

export default function AdminContentPage() {
  const { data: session } = useSession();
  const { recipes, fetchRecipes, loading: loadingRecipes } = useRecipe();
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loadingTutorials, setLoadingTutorials] = useState(true);

  // ================= FETCH TUTORIALS =================
  const fetchTutorials = async () => {
    if (!session?.backendToken) return;
    setLoadingTutorials(true);
    try {
      const data = await adminService.getAllTutorials(session.backendToken);
      setTutorials(data);
    } catch (err) {
      console.error("Error al traer tutoriales:", err);
    } finally {
      setLoadingTutorials(false);
    }
  };

  // ✅ CAMBIO MÍNIMO: esperamos token para traer TODAS las recetas
  useEffect(() => {
    if (!session?.backendToken) return;
    fetchRecipes();
  }, [session]);

  return (
    <div className="flex flex-col gap-8 p-4 pb-28 bg-[#181411] min-h-screen px-4 sm:px-8 lg:px-16">
      {/* HEADER */}
      <header>
        <h1 className="text-2xl font-bold text-white border-l-4 border-orange-500 pl-3">
          Contenido
        </h1>
        <p className="text-sm text-white/60 mt-1 ml-4">
          Listado de recetas 
        </p>
      </header>

      {/* RECIPES */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Recetas</h2>

        {loadingRecipes ? (
          <p className="text-white/60">Cargando recetas...</p>
        ) : recipes.length === 0 ? (
          <p className="text-white/60">No hay recetas disponibles</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                mode="admin"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
