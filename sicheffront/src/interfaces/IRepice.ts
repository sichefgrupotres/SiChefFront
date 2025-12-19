export interface RecipeInterface {
  id: string;
  title: string;
  // image: string
  difficulty: "facil" | "medio" | "dificil";
  isPremium: boolean;

}
