"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { ArrowLeft, BarChart3, Crown } from "lucide-react";

// Interfaces
interface Recipe {
    id: string;
    title: string;
    description: string;
    ingredients: string;
    difficulty: "facil" | "medio" | "dificil";
    imageUrl: string;
    isPremium: boolean;
    category?: string[] | string;
}

export default function UserRecipeDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchRecipe = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`);
                if (res.status === 404) {
                    router.push("/home");
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
            <div className="flex justify-center items-center h-96 text-white font-medium animate-pulse">
                Cargando receta...
            </div>
        );
    }

    if (!recipe) return null;

    // Declaramos isPremium para usarlo en el renderizado
    const isPremium = recipe.isPremium;

    /* ================= INGREDIENTES COMO LISTA ================= */
    const ingredientsList = recipe.ingredients
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

    /* ================= CATEGORÍAS → FONDO ================= */
    const categoryImages: Record<string, string> = {
        Desayunos: "/categories/desayuno.jpg",
        Almuerzos: "/categories/almuerzo.jpg",
        Meriendas: "/categories/merienda.jpg",
        Cenas: "/categories/cena.jpg",
        Postres: "/categories/postres.jpg",
    };

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

    const mainCategory = categoriesArray[0];
    const backgroundImage = categoryImages[mainCategory] || recipe.imageUrl;

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            {/* ===== VOLVER ===== */}
            <button
                onClick={() => router.push("/user")} 
                className="flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 mb-6 transition cursor-pointer"
            >
                <ArrowLeft size={16} />
                Volver al inicio
            </button>

            {/* ===== IMAGEN HERO ===== */}
            <div className="w-full h-[420px] mb-8 flex items-center justify-center">
                <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-lg"
                />
            </div>

            {/* ===== HEADER ===== */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-[#F57C00] mb-2">
                    {recipe.title}
                </h1>

                <div className="flex justify-center items-center gap-4 text-white/70">
                    <div className="flex items-center gap-2">
                        <BarChart3 size={16} />
                        <span className="capitalize">{recipe.difficulty}</span>
                    </div>

                    {isPremium && (
                        <span className="flex items-center gap-1 text-sm bg-[#F57C00] px-3 py-1 rounded-full text-white font-bold">
                            <Crown size={14} />
                            Premium
                        </span>
                    )}
                </div>
            </div>

            {/* ===== GRID DE CONTENIDO ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                
                {!isPremium ? (
                    <>
                        {/* INGREDIENTES */}
                        <section className="relative rounded-xl overflow-hidden border border-white/10">
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${backgroundImage})` }}
                            />
                            <div className="absolute inset-0 bg-black/70" />
                            <div className="relative z-10 p-6">
                                <h2 className="text-xl font-semibold mb-4 text-[#F57C00]">
                                    Ingredientes
                                </h2>
                                <ul className="space-y-2 text-white/90">
                                    {ingredientsList.map((ingredient, index) => (
                                        <li key={index} className="flex gap-2">
                                            <span className="text-[#F57C00] font-bold">•</span>
                                            <span>{ingredient}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* PREPARACIÓN */}
                        <section className="bg-[#2a221b] rounded-xl p-6 border border-white/10">
                            <h2 className="text-xl font-semibold mb-4 text-[#F57C00]">
                                Preparación
                            </h2>
                            <p className="text-white/80 whitespace-pre-line leading-relaxed">
                                {recipe.description}
                            </p>
                        </section>
                    </>
                ) : (
                    /* ================= CTA PREMIUM ================= */
                    <section className="md:col-span-2 bg-[#2a221b] rounded-3xl p-12 border border-[#F57C00]/40 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent" />

                        <div className="relative z-10 flex flex-col items-center gap-6">
                            <div className="bg-[#F57C00]/20 p-4 rounded-full">
                                <Crown size={48} className="text-[#F57C00]" />
                            </div>

                            <h2 className="text-3xl font-bold text-white">
                                Contenido Exclusivo Premium 🍽️
                            </h2>

                            <p className="text-white/80 max-w-xl text-lg">
                                Esta receta está reservada para nuestros miembros exclusivos. 
                                Suscríbete para desbloquear los ingredientes y el paso a paso detallado.
                            </p>

                            <button
                                onClick={() => router.push("/subscriptions")}
                                className="px-10 py-4 rounded-full bg-[#F57C00] text-white font-bold text-lg hover:bg-orange-600 transition shadow-xl active:scale-95"
                            >
                                Suscribirme ahora
                            </button>

                            <span className="text-sm text-white/50 italic">
                                Acceso ilimitado a todas las recetas Premium
                            </span>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}