import * as Yup from "yup";

/* =========================
   INTERFACES
========================= */

export interface IngredientItem {
  title: string;
  description: string;
}

export interface TutorialFormValuesInterface {
  title: string;
  description: string;
  file: File | null;
  ingredients: IngredientItem[];
  steps: string[];
}

/* =========================
   INITIAL VALUES
========================= */

export const initialValuesTutorial: TutorialFormValuesInterface = {
  title: "",
  description: "",
  file: null,
  ingredients: [],
  steps: [],
};

/* =========================
   YUP SCHEMA
========================= */

export const TutorialSchema = Yup.object({
  title: Yup.string()
    .required("El nombre del tutorial es obligatorio"),

  description: Yup.string()
    .required("La descripción es obligatoria"),

  file: Yup.mixed<File>()
    .required("Debes subir un video"),

  ingredients: Yup.array()
    .of(
      Yup.object({
        title: Yup.string().required("El nombre del ingrediente es obligatorio"),
        description: Yup.string().required(
          "La descripción del ingrediente es obligatoria"
        ),
      })
    )
    .min(1, "Agregá al menos un ingrediente")
    .required(),

  steps: Yup.array()
    .of(Yup.string().required("El paso no puede estar vacío"))
    .min(1, "Agregá al menos un paso")
    .required(),
});