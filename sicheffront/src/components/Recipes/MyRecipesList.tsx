"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import RecipeCardCreator from "./CardRecipeCreator";
import { useRecipe } from "@/context/RecipeContext";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

export default function MyRecipesList() {
  const { userRecipes, fetchMyRecipes, deleteRecipe, loading, error } =
    useRecipe();

  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      fetchMyRecipes();
    }
  }, [status]);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "¿Eliminar receta?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    await deleteRecipe(id);

    Swal.fire({
      icon: "success",
      title: "Receta eliminada",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
      {!userRecipes || userRecipes.length === 0 ? (
        <p className="text-white col-span-full text-center">
          Aún no has creado recetas.
        </p>
      ) : (
        userRecipes.map((recipe) => (
          <RecipeCardCreator
            key={recipe.id}
            recipe={recipe}
            mode="creator"
            onEdit={() => router.push(`/creator/recipes/${recipe.id}/edit`)}
            onRemove={() => handleDelete(recipe.id)}
          />
        ))
      )}
    </div>
  );
}
