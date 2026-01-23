import * as Yup from "yup";

export interface TutorialFormValues {
  title: string;
  video: File | null;
  description: string;
  recipeId: string;
  recipe?: {
    id: string;
    title: string;
  };
  ingredients: {
    title: string;
    description?: string;
  }[];
  steps: {
    order: number;
    description: string;
  }[];
}

export const initialValuesTutorial: TutorialFormValues = {
  title: "",
  video: null,
  description: "",
  recipeId: "",
  ingredients: [],
  steps: [],
};

export const TutorialFormSchema = Yup.object({
  title: Yup.string().required("El nombre del tutorial es obligatorio"),

  video: Yup.mixed<File>()
    .nullable()
    .required("Debes subir un video")
    .test("fileType", "Formato de video no válido", (value) => {
      if (!value) return false;
      return ["video/mp4", "video/webm", "video/ogg"].includes(value.type);
    }),
  description: Yup.string().required("La descripción es obligatoria"),

  recipeId: Yup.string().required("Debes seleccionar una receta"),

  ingredients: Yup.array().optional(),
  steps: Yup.array().optional(),
});
