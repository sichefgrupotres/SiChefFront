"use client";

import { useState, useEffect } from "react";
import { PATHROUTES } from "@/utils/PathRoutes";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import MyRecipesList from "@/components/Recipes/MyRecipesList";
import { useSession } from "next-auth/react";
import MyTutorialsList from "@/components/Tutorials/MyTutorialsList";
import { useSearchParams } from "next/navigation";
import RecipeCard from "@/components/Recipes/CardRecipe";
import { RecipeInterface } from "@/interfaces/IRecipe";

export default function CreatorPage() {
  // ================= HOOKS Y ESTADOS GENERALES =================
  const { dataUser, isLoadingUser } = useAuth();
  const { data: session, update } = useSession();
  const searchParams = useSearchParams();

  const userInfo = dataUser?.user;
  const fullName = userInfo
    ? `${userInfo.name} ${userInfo.lastname}`
    : "Chef Invitado";

  const [avatar, setAvatar] = useState(
    dataUser?.user?.avatarUrl || "/chef-avatar.jpg",
  );
  const [uploading, setUploading] = useState(false);

  // Unificamos los tipos de tabs para incluir 'favorites'
  const [activeTab, setActiveTab] = useState<"recipes" | "tutorials" | "favorites">("recipes");

  // Estados para contadores (Estadísticas)
  const [recipes, setRecipes] = useState<any[]>([]);
  const [tutorials, setTutorials] = useState<any[]>([]);

  // Estados para Favoritos (Funcionalidad del Código 2)
  const [favorites, setFavorites] = useState<RecipeInterface[]>([]);
  const [loadingFavs, setLoadingFavs] = useState(false);

  // ================= EFECTOS =================

  // 1. Manejo de Query Params (URL)
  const tab = searchParams.get("tab");
  useEffect(() => {
    if (tab === "tutorials") setActiveTab("tutorials");
    if (tab === "favorites") setActiveTab("favorites");
    if (tab === "recipes") setActiveTab("recipes");
  }, [tab]);

  // 2. Fetch de Datos Generales (Para contadores y estadísticas)
  useEffect(() => {
    if (!session?.backendToken) return;

    const fetchData = async () => {
      try {
        const recipesRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/posts/my-posts`,
          {
            headers: { Authorization: `Bearer ${session.backendToken}` },
          },
        );

        const tutorialsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tutorials/my-tutorials`,
          {
            headers: { Authorization: `Bearer ${session.backendToken}` },
          },
        );

        const recipesData = await recipesRes.json();
        const tutorialsData = await tutorialsRes.json();

        setRecipes(recipesData.data ?? recipesData);
        setTutorials(tutorialsData.data ?? tutorialsData);
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      }
    };

    fetchData();
  }, [session]);

  // 3. Fetch de Favoritos (Solo cuando se activa la tab)
  useEffect(() => {
    if (activeTab === "favorites" && session?.backendToken) {
      const fetchFavorites = async () => {
        setLoadingFavs(true);
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/favorites/my-list`, {
            headers: {
              Authorization: `Bearer ${session.backendToken}`
            }
          });

          if (res.ok) {
            const data = await res.json();
            // Aseguramos que tengan la propiedad isFavorite para el botón
            const formatted = data.map((item: any) => ({ ...item, isFavorite: true }));
            setFavorites(formatted);
          }
        } catch (error) {
          console.error("Error cargando favoritos:", error);
        } finally {
          setLoadingFavs(false);
        }
      };
      fetchFavorites();
    }
  }, [activeTab, session]);

  // ================= FUNCIONES =================

  const recipesCount = recipes.length;
  const tutorialsCount = tutorials.length;

  // Eliminar visualmente de la lista de favoritos
  const handleRemoveFromList = (recipeId: string | number) => {
    setFavorites((prev) => prev.filter((item) => item.id !== recipeId));
  };

  // Subida de Avatar
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session?.backendToken) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/avatar`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.backendToken}`,
          },
          body: formData,
        },
      );

      if (!res.ok) return;

      const data = await res.json();
      setAvatar(data.avatarUrl);

      await update({
        ...session,
        user: {
          ...session.user,
          avatarUrl: data.avatarUrl,
        },
      });
    } catch (error) {
      console.error("Error en la subida:", error);
    } finally {
      setUploading(false);
    }
  };

  // ================= RENDERIZADO =================
  return (
    <div className="flex flex-col gap-8 p-4 pb-28 bg-[#181411] min-h-screen px-4 sm:px-8 lg:px-16">
      {/* SECCIÓN PERFIL */}
      <section className="px-4 md:px-8 py-16 flex flex-col items-center gap-4 text-center">
        <div className="relative w-32 h-32">
          <img
            src={session?.user?.avatarUrl || avatar}
            alt="Perfil"
            className={`w-full h-full object-cover rounded-full shadow-sm transition-opacity duration-300 ${uploading ? "opacity-50" : "opacity-100"
              }`}
          />

          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full z-10">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <label
            className={`absolute bottom-0 right-0 translate-x-1 translate-y-1 
            w-9 h-9 rounded-full bg-[#F57C00] flex items-center justify-center 
            shadow-lg border-2 border-white transition 
            ${uploading
                ? "cursor-not-allowed opacity-70"
                : "cursor-pointer hover:scale-105 active:scale-95"
              }`}
          >
            <span className="material-symbols-outlined text-white text-[20px]">
              {uploading ? "hourglass_empty" : "photo_camera"}
            </span>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              disabled={uploading}
            />
          </label>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-[#F57C00] text-3xl md:text-5xl font-bold capitalize">
            {isLoadingUser ? "Cargando..." : fullName}
          </h1>

          {userInfo?.email && (
            <p className="text-gray-500 font-medium">{userInfo.email}</p>
          )}
        </div>
      </section>

      {/* SECCIÓN ESTADÍSTICAS */}
      <section className="px-4 md:px-8 pb-8">
        <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-orange-500 pl-3">
          Descripción general
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-[#2a221b] rounded-xl p-4">
            <p className="text-sm text-white/60">Recetas</p>
            <p className="text-xl font-semibold text-[#e6e0db]">
              {recipesCount}
            </p>
          </div>

          <div className="bg-[#2a221b] rounded-xl p-4">
            <p className="text-sm text-white/60">Tutoriales</p>
            <p className="text-xl font-semibold text-[#e6e0db]">
              {tutorialsCount}
            </p>
          </div>
        </div>
      </section>

      {/* BOTONES DE ACCIÓN */}
      <section className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
        <Link
          href={PATHROUTES.NEWRECIPE}
          className="w-full sm:w-48 py-3 rounded-lg bg-orange-500/20 text-[#F57C00] font-semibold
          flex items-center justify-center gap-2
          hover:bg-[#F57C00] hover:text-white transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[26px]">
            restaurant_menu
          </span>
          <span>Nueva Receta</span>
        </Link>

        <Link href={PATHROUTES.NEWTUTORIAL}>
          <button
            className="w-full sm:w-48 py-3 rounded-lg bg-orange-500/20 text-[#F57C00] font-semibold
            flex items-center justify-center gap-2
            hover:bg-[#F57C00] hover:text-white transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[26px]">
              video_camera_front
            </span>
            <span>Nuevo tutorial</span>
          </button>
        </Link>
      </section>

      {/* NAVEGACIÓN TABS (RECETAS / TUTORIALES / FAVORITOS) */}
      <section className="px-4 md:px-8">
        <div className="flex gap-6 border-b border-white/10 overflow-x-auto">
          <button
            onClick={() => setActiveTab("recipes")}
            className={`pb-3 font-semibold transition cursor-pointer whitespace-nowrap
              ${activeTab === "recipes"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-400 hover:text-white"
              }`}
          >
            Mis Recetas
          </button>

          <button
            onClick={() => setActiveTab("tutorials")}
            className={`pb-3 font-semibold transition cursor-pointer whitespace-nowrap
              ${activeTab === "tutorials"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-400 hover:text-white"
              }`}
          >
            Mis Tutoriales
          </button>

          <button
            onClick={() => setActiveTab("favorites")}
            className={`pb-3 font-semibold transition cursor-pointer whitespace-nowrap
              ${activeTab === "favorites"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-400 hover:text-white"
              }`}
          >
            Favoritos
          </button>
        </div>
      </section>

      {/* CONTENIDO DINÁMICO */}
      <section className="px-4 md:px-8 pb-16 bg-[#181411]">

        {/* 1. RECETAS */}
        {activeTab === "recipes" && <MyRecipesList />}

        {/* 2. TUTORIALES (Retomamos el componente del código 1) */}
        {activeTab === "tutorials" && <MyTutorialsList />}

        {/* 3. FAVORITOS (Lógica del código 2) */}
        {activeTab === "favorites" && (
          <div className="mt-6">
            {loadingFavs ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin h-8 w-8 border-2 border-[#F57C00] rounded-full border-t-transparent"></div>
              </div>
            ) : favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favorites.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    mode="creator"
                    // Pasamos la función para que al quitar like se borre de la lista
                    onRemove={() => handleRemoveFromList(recipe.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-16 bg-[#2a221b]/30 rounded-xl border border-gray-800 border-dashed">
                <p>No tienes recetas guardadas en favoritos.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}