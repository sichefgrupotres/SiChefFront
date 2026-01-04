"use client";

import { createPost } from "@/services/auth.services";

import {
  RecipeFormValuesInterface,
  initialValuesRecipe,
  RecipeSchema,
} from "@/validators/RecipeSchema";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

export default function NewRecipePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const formik = useFormik<RecipeFormValuesInterface>({
    initialValues: initialValuesRecipe,
    validationSchema: RecipeSchema,
    onSubmit: async (values, { resetForm }) => {
      if (loading) return;
      setLoading(true);
      if (!values.file) {
        Swal.fire({
          icon: "warning",
          title: "Imagen requerida",
          text: "Debes subir una imagen",
        });
        return;
      }

      const success = await createPost({
        title: values.title,
        description: values.description,
        ingredients: values.ingredients,
        difficulty: values.difficulty,
        isPremium: values.isPremium,
        file: values.file,
      }, session);

      if (success) {
        Swal.fire({
          icon: "success",
          title: "Receta publicada",
          text: "Tu receta se creó correctamente",
          confirmButtonText: "Aceptar",
        }).then(() => {
          resetForm();
          setImagePreview(null);
          router.push("/creator/recipes");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo crear la receta",
        });
      }
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];

    if (!file) return;

    formik.setFieldValue("file", file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Crear nueva receta
      </h1>

      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        {/* Título */}
        <div>
          <label className="text-sm font-semibold">Título de la receta</label>
          <input
            type="text"
            name="title"
            placeholder="ej. Lasaña clásica"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full mt-1 rounded-lg bg-[#2a221b] border border-white/10 px-5 py-3 outline-none focus:border-primary"
          />
          {formik.touched.title && formik.errors.title && (
            <p className="text-red-400 text-sm">{formik.errors.title}</p>
          )}
        </div>

        {/* Foto Principal */}
        <div>
          <label className="text-sm font-semibold">Foto Principal</label>

          <div className="mt-2 flex items-center gap-4">
            <div className="w-72 h-64 rounded-lg bg-[#2a221b] border border-white/10 flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-gray-400 text-3xl">
                  image
                </span>
              )}
            </div>

            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <span className="px-5 py-3 rounded-lg bg-[#3a2e24] border border-white/10 text-sm hover:bg-[#46372c] transition">
                Subir imagen
              </span>
            </label>
          </div>
        </div>

        {/* Ingredientes */}
        <div>
          <label className="text-sm font-semibold">Ingredientes</label>
          <textarea
            name="ingredients"
            rows={4}
            placeholder="Ingredientes que contiene la receta"
            value={formik.values.ingredients}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full mt-1 rounded-lg bg-[#2a221b] border border-white/10 px-5 py-3 outline-none focus:border-primary resize-none"
          />
          {formik.touched.ingredients && formik.errors.ingredients && (
            <p className="text-red-400 text-sm">{formik.errors.ingredients}</p>
          )}
        </div>

        {/* Pasos de preparación */}
        <div>
          <label className="text-sm font-semibold">Pasos de preparación</label>
          <textarea
            name="description"
            rows={4}
            placeholder={`Ej:
1. Calentamos una cazuela grande de agua...
2. Introducimos las láminas de lasaña...`}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full mt-1 rounded-lg bg-[#2a221b] border border-white/10 px-5 py-3 outline-none focus:border-primary resize-none"
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-400 text-sm">{formik.errors.description}</p>
          )}
        </div>

        {/* Dificultad */}
        <div>
          <label className="text-sm font-semibold">Dificultad</label>
          <select
            name="difficulty"
            value={formik.values.difficulty}
            onChange={formik.handleChange}
            className="w-full mt-1 rounded-lg bg-[#2a221b] border border-white/10 px-5 py-3"
          >
            <option value="facil">Fácil</option>
            <option value="medio">Medio</option>
            <option value="dificil">Difícil</option>
          </select>
        </div>

        {/* PREMIUM */}
        <div className="flex items-center justify-between rounded-xl bg-[#2a221b] border border-white/10 px-5 py-4">
          <div>
            <p className="text-white font-semibold">Marcar como Premium</p>
            <p className="text-sm text-white/60">
              Solo los suscriptores podrán acceder.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isPremium"
              checked={formik.values.isPremium}
              onChange={formik.handleChange}
              className="sr-only peer"
            />

            <div className="w-11 h-6 rounded-full bg-gray-500 peer-checked:bg-green-500 transition-colors duration-300" />
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5" />
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`mt-4 h-12 rounded-lg font-bold transition
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#F57C00] hover:bg-orange-500 cursor-pointer"
            }
          `}
        >
          {loading ? "Publicando..." : "Publicar receta"}
        </button>
      </form>
    </div>
  );
}
