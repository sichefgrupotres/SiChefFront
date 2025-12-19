export interface RecipeInterface {
  id: string;
  title: string;
  imageUrl: string
  difficulty: "facil" | "medio" | "dificil";
  isPremium: boolean;

}
