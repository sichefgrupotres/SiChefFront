"use client";

import { createContext, useContext, useState } from "react";
import { RecipeInterface, CreateRecipePayload } from "@/interfaces/IRecipe";
import { useSession } from "next-auth/react";

interface RecipeContextProps {
  recipes: RecipeInterface[];
  userRecipes: RecipeInterface[];
  loading: boolean;
  error: string | null;
  fetchRecipes: () => Promise<void>;

  addRecipe: (data: CreateRecipePayload) => Promise<boolean>;

  updateRecipe: (
    id: string,
    data: Partial<RecipeInterface>
  ) => Promise<boolean>;

  deleteRecipe: (id: string) => Promise<void>;
  getRecipeById: (id: string) => RecipeInterface | undefined;
}

const RecipeContext = createContext<RecipeContextProps>(
  {} as RecipeContextProps
);

interface RecipeProviderProps {
  children: React.ReactNode;
}

export const RecipeProvider = ({ children }: RecipeProviderProps) => {
 const { data: session } = useSession();
const token = session?.backendToken;

  const [recipes, setRecipes] = useState<RecipeInterface[]>([]);
  const [userRecipes, setUserRecipes] = useState<RecipeInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

 const fetchRecipes = async () => {
  try {
    setLoading(true);

    const res = await fetch("http://localhost:3001/posts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    setRecipes(json.data);
  } catch {
    setError("Error al obtener recetas");
  } finally {
    setLoading(false);
  }
};


  const addRecipe = async (data: CreateRecipePayload): Promise<boolean> => {
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
      formData.append("ingredients", data.ingredients);
      formData.append("difficulty", data.difficulty);
      formData.append("isPremium", String(data.isPremium));
      formData.append("file", data.file);
      formData.append("categories", JSON.stringify(data.categories));




      const res = await fetch("http://localhost:3001/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      const res = await fetch(`http://localhost:3001/posts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error();
      await fetchRecipes();
      return true;
    } catch {
      setError("Error al actualizar receta");
      return false;
    }
  };

  const deleteRecipe = async (id: string) => {
    try {
      await fetch(`http://localhost:3001/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchRecipes();
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
