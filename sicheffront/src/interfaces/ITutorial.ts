export interface TutorialInterface {
  id: string;
  title: string;
  videoUrl: string;
   recipeId: string;
  recipe?: {
    id: string;
    title: string;
  };
  ingredients: {
    title: string;
    description?: string;
  }[];
  description: string;
  step: {
    id: string;
    order: number; 
    description: string; 
  }[];
}
