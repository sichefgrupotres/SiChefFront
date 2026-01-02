"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { BarChart3, Crown } from "lucide-react";

interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string;
  difficulty: "facil" | "medio" | "dificil";
  imageUrl: string;
  isPremium: boolean;
}

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

   const fetchRecipe = async () => {
  try {
    const res = await fetch(`http://localhost:3001/posts/${id}`, {
      method: "GET", // explícitamente GET
      headers: {
        "Content-Type": "application/json", // si tu backend espera JSON
        // "Authorization": `Bearer ${token}`, // si necesitas auth
      },
    });

    console.log("Fetch status:", res.status);

        if (res.status === 404) {
          router.push("/404");
          return;
        }

        if (!res.ok) throw new Error();

        const data = await res.json();
        setRecipe(data);
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar la receta",
        });
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
    <div className="max-w-5xl mx-auto p-4">
      {/* Imagen */}
      <div className="w-full h-80 rounded-xl overflow-hidden mb-6">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Header */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-white">
            {recipe.title}
          </h1>

          {recipe.isPremium && (
            <span className="flex items-center gap-1 text-sm bg-[#F57C00] px-3 py-1 rounded-full text-white">
              <Crown size={14} />
              Premium
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-white/80">
          <BarChart3 size={16} />
          <span className="capitalize">{recipe.difficulty}</span>
        </div>
      </div>

      {/* Ingredientes */}
      <section className="mb-6 bg-[#2a221b] rounded-xl p-5 border border-white/10">
        <h2 className="text-lg font-semibold mb-3 text-white">
          Ingredientes
        </h2>
        <p className="text-white/80 whitespace-pre-line">
          {recipe.ingredients}
        </p>
      </section>

      {/* Preparación */}
      <section className="bg-[#2a221b] rounded-xl p-5 border border-white/10">
        <h2 className="text-lg font-semibold mb-3 text-white">
          Pasos de preparación
        </h2>
        <p className="text-white/80 whitespace-pre-line">
          {recipe.description}
        </p>
      </section>
    </div>
  );
}
