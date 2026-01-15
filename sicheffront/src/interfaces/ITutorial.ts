export interface TutorialInterface {
  id: string;
  title: string;
  videoUrl: string;
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
