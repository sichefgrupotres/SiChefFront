"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import RecipeDetail, { Recipe } from "@/components/Recipes/RecipeDetail";
import { useAuth } from "@/context/AuthContext"

export default function UserRecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`
        );

        if (res.status === 404) {
          router.push("/404");
          return;
        }

        if (!res.ok) throw new Error();
        setRecipe(await res.json());
      } catch {
        Swal.fire("Error", "No se pudo cargar la receta", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-white">
        Cargando receta...
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <RecipeDetail
      recipe={recipe}
      backLabel="Volver a mis recetas"
      showBackButton
    />
  );
}

// // "use client";

// // import { useEffect, useState } from "react";
// // import { useParams, useRouter } from "next/navigation";
// // import Swal from "sweetalert2";
// // import RecipeDetail, { Recipe } from "@/components/Recipes/RecipeDetail";

// // export default function UserRecipeDetailPage() {
// //   const { id } = useParams<{ id: string }>();
// //   const router = useRouter();

// //   const [recipe, setRecipe] = useState<Recipe | null>(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     if (!id) return;

// //     const fetchRecipe = async () => {
// //       try {
// //         const res = await fetch(
// //           `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`
// //         );

// //         if (res.status === 404) {
// //           router.push("/404");
// //           return;
// //         }

// //         if (!res.ok) throw new Error();
// //         setRecipe(await res.json());
// //       } catch {
// //         Swal.fire("Error", "No se pudo cargar la receta", "error");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchRecipe();
// //   }, [id, router]);

// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center h-96 text-white">
// //         Cargando receta...
// //       </div>
// //     );
// //   }

// //   if (!recipe) return null;

// //   return (
// //     <RecipeDetail
// //       recipe={recipe}
// //       backLabel="Volver a mis recetas"
// //       showBackButton
// //     />
// //   );
// // }