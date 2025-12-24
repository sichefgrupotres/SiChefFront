export type Difficulty = "facil" | "medio" | "dificil";

export interface RecipeInterface {
  id: string;
  title: string;
  image: string;
  ingredients: string;
  description: string;
  difficulty: Difficulty;
  isPremium: boolean;
}
export interface CreateRecipePayload {
  title: string;
  description: string;
  ingredients: string;
  difficulty: Difficulty;
  isPremium: boolean;
  file: File;
}