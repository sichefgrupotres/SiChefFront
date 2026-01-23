"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { RecipeInterface, CreateRecipePayload } from "@/interfaces/IRecipe";
import { useSession } from "next-auth/react";

interface RecipeContextProps {
  recipes: RecipeInterface[];
  userRecipes: RecipeInterface[];
  loading: boolean;
  error: string | null;
  fetchRecipes: () => Promise<void>;
  fetchMyRecipes: () => Promise<void>;
  addRecipe: (data: CreateRecipePayload) => Promise<boolean>;
  updateRecipe: (
    id: string,
    data: Partial<RecipeInterface>
  ) => Promise<UpdatePostResponse>;
  deleteRecipe: (id: string) => Promise<void>;
  getRecipeById: (id: string) => RecipeInterface | undefined;
}

const RecipeContext = createContext<RecipeContextProps>({} as RecipeContextProps);

interface RecipeProviderProps {
  children: React.ReactNode;
}

export interface UpdatePostResponse {
  statusPost: "SAFE" | "BLOCKED" | "NEEDS_REVIEW";
  message: string;
  post: RecipeInterface;
}

export const RecipeProvider = ({ children }: RecipeProviderProps) => {
  const { data: session } = useSession();
  const token = session?.backendToken;

  const [recipes, setRecipes] = useState<RecipeInterface[]>([]);
  const [userRecipes, setUserRecipes] = useState<RecipeInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar recetas públicas
  useEffect(() => {
    fetchRecipes();
  }, []);

  // Cargar recetas del usuario SOLO si hay token
  useEffect(() => {
    if (token) fetchMyRecipes();
  }, [token]);

  const fetchRecipes = async (page = 1, limit = 5) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const json = await res.json();
      setRecipes(json.data || json);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setError(err instanceof Error ? err.message : "Error al obtener recetas");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRecipes = async (page = 1, limit = 5) => {
    if (!token) return; // Evita errores si no hay token
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/my-posts?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) {
        console.warn("No se pudieron cargar tus recetas", res.status); // Solo loguea sin romper
        return;
      }
      const data = await res.json();
      setUserRecipes(data.data || data);
    } catch (err) {
      console.error("Error fetching my recipes:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const addRecipe = async (data: CreateRecipePayload) => {
    if (!token) {
      setError("No autorizado");
      return false;
    }
    if (!data.file) {
      setError("Debes seleccionar una imagen");
      return false;
    }
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("ingredients", JSON.stringify(data.ingredients));
      formData.append("difficulty", data.difficulty);
      formData.append("isPremium", String(data.isPremium));
      formData.append("file", data.file);
      formData.append("category", JSON.stringify(data.category));

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error();
      await fetchRecipes();
      return true;
    } catch {
      setError("Error al crear receta");
      return false;
    }
  };

  const updateRecipe = async (id: string, data: Partial<RecipeInterface>) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();

      const result = await res.json();
      await fetchRecipes();

      return result;
    } catch {
      setError("Error al actualizar receta");
      return null;
    }
  };

  const deleteRecipe = async (id: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch {
      setError("Error al eliminar receta");
    }
  };

  const getRecipeById = (id: string) => recipes.find((r) => r.id === id);

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        userRecipes,
        loading,
        error,
        fetchRecipes,
        fetchMyRecipes,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        getRecipeById,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipe = () => useContext(RecipeContext);

