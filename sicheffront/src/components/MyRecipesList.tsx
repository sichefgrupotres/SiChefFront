"use client";

import { useEffect } from "react";
import RecipeCard from "@/components/CardRecipe";
import { useRecipe } from "@/context/RecipeContext";

export default function MyRecipesList() {
  const { userRecipes, fetchMyRecipes, loading, error } = useRecipe();

  useEffect(() => {
    console.log("🔍 MyRecipesList mounted, calling fetchMyRecipes");
    fetchMyRecipes();
  }, []);

  console.log("🔍 MyRecipesList state:", {
    userRecipesCount: userRecipes?.length,
    loading,
    error,
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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
      {!userRecipes || userRecipes.length === 0 ? (
        <p className="text-white col-span-full text-center">
          Aún no has creado recetas.
        </p>
      ) : (
        userRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))
      )}
    </div>
  );
}
