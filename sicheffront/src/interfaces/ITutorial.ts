export interface TutorialInterface {
  id: string;
  title: string;
  description: string;
  video?: File;
  recipeId: string;
  thumbnailUrl?: string;
  recipe?: {
    id: string;
    title: string;
  };
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  ingredients: {
    title: string;
    description?: string;
  }[];
  steps: {
    description: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}
