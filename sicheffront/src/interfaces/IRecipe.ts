export type Difficulty = "facil" | "medio" | "dificil";

export interface RecipeInterface {
  id: string;
  title: string;
  imageUrl: string;
  ingredients: string;
  description: string;
  difficulty: Difficulty;
  isPremium: boolean;
  categories: string[];
}
export interface CreateRecipePayload {
  title: string;
  description: string;
  ingredients: string;
  difficulty: Difficulty;
  isPremium: boolean;
  file: File;
  categories: string[];
}