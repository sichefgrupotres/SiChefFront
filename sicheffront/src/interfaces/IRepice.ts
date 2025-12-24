export interface RecipeInterface {
  id: string;
  title: string;
  file: string;
  difficulty: "facil" | "medio" | "dificil";
  isPremium: boolean;

}
