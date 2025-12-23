'use client'

import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";


interface Recipe {
  id: string;
  title: string;
  imageUrl: string;
  ingredients: string;
  description: string;
  difficulty: "facil" | "medio" | "dificil";
  isPremium: boolean;
}



interface RecipeContextProps {
    recipes: Recipe[];            // Lista general (feed)
    userRecipes: Recipe[];        // Lista del creador actual
    loading: boolean;             // Para mostrar un spinner/skeleton
    error: string | null;         // Para manejar errores de la API
    fetchRecipes: () => Promise<void>;                      // Traer todo de la DB
    addRecipe: (recipe: Recipe) => Promise<boolean>;        // Crear (retorna true si tuvo éxito)
    updateRecipe: (id: string, recipe: Recipe) => Promise<boolean>; // Editar
    deleteRecipe: (id: string) => Promise<void>;            // Eliminar
    getRecipeById: (id: string) => Recipe | undefined;      // Buscar una sola
}

const RecipeContext = createContext<RecipeContextProps>({
    recipes: [],
    userRecipes: [],
    loading: false,
    error: null,
    fetchRecipes: async () => {},
    addRecipe: async () => false,
    updateRecipe: async () => false,
    deleteRecipe: async () => {},
    getRecipeById: () => undefined
});

interface RecipeProviderProps {
    children: React.ReactNode;
}

export const RecipeProvider: React.FC<RecipeProviderProps> = ({ children }) => {
    const {dataUser} = useAuth();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);




