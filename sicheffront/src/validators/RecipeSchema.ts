import { Difficulty } from "@/interfaces/IRecipe";
import * as Yup from "yup";

// Definimos la interfaz de los valores del formulario, en este caso es de nueva receta
export interface RecipeFormValuesInterface {
  title: string;
  description: string;
  ingredients: string;
  isPremium: boolean;
  difficulty: Difficulty;
  file: File | null;
  category: string[];
}

export const initialValuesRecipe: RecipeFormValuesInterface = {
  title: "",
  description: "",
  ingredients: "",
  difficulty: "facil",
  isPremium: false,
  file: null,
  category: [],
};

export const RecipeSchema = Yup.object({
  title: Yup.string().required("El título es obligatorio"),
  description: Yup.string().required("La descripción es obligatoria"),
  ingredients: Yup.string().required("Agregá al menos un ingrediente"),
  isPremium: Yup.boolean(),
  category: Yup.array()
    .min(1, "Seleccioná al menos una categoría")
    .required(),
});
