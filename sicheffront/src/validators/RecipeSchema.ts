import * as Yup from "yup";

// Definimos la interfaz de los valores del formulario, en este caso es de nueva receta
export interface RecipeFormValuesInterface {
    title: string;
    description: string;
    ingredients: string;
    image: File | null;
    isPremium: boolean;
    difficulty: string;
}

export const initialValuesRecipe: RecipeFormValuesInterface = {
    title: "",
    description: "",
    ingredients: "",
    image: null,
    isPremium: false,
    difficulty: "facil",
}


export const RecipeSchema = Yup.object({
    title: Yup.string().required("El título es obligatorio"),
    description: Yup.string().required("La descripción es obligatoria"),
    ingredients: Yup.string().required("Agregá al menos un ingrediente"),
    isPremium: Yup.boolean(),
})