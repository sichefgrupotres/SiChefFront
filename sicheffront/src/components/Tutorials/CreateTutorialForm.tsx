"use client";

import { createTutorial } from "@/services/tutorials.services";
import {
  TutorialFormValues,
  initialValuesTutorial,
  TutorialFormSchema,
} from "@/validators/TutorialSchema";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import { ArrowLeft, ArrowLeftCircleIcon, Trash2 } from "lucide-react";
import { useRecipe } from "@/context/RecipeContext";

export default function NewTutorial() {
  const router = useRouter();
  const { data: session } = useSession();
  const { userRecipes, loading: loadingRecipes } = useRecipe();

  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [ingredientTitle, setIngredientTitle] = useState("");
  const [ingredientDescription, setIngredientDescription] = useState("");
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  const [stepDraft, setStepDraft] = useState("");
  const [openRecipes, setOpenRecipes] = useState(false);

  const handleVideoDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Selecciona un archivo de video válido");
      return;
    }

    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }

    formik.setFieldValue("video", file, false);
    formik.setFieldTouched("video", true, false);
    formik.setFieldError("video", undefined);
    setVideoPreview(URL.createObjectURL(file));
  };

  const formik = useFormik<TutorialFormValues>({
    initialValues: initialValuesTutorial,
    validationSchema: TutorialFormSchema,
    validateOnChange: false,
    validateOnBlur: false,
    validateOnMount: false,

    onSubmit: async (values, { resetForm, setTouched }) => {
      setTouched({
        title: true,
        video: true,
        description: true,
        ingredients: [],
        steps: [],
      });

      if (loading) return;
      setLoading(true);

      if (!session?.backendToken) {
        Swal.fire({
          icon: "error",
          title: "Sesión inválida",
          text: "Debes iniciar sesión nuevamente",
        });
        setLoading(false);
        return;
      }

      if (!values.video) {
        Swal.fire({
          icon: "warning",
          title: "Video requerido",
          text: "Debes subir un video",
        });
        setLoading(false);
        return;
      }

      const success = await createTutorial(
        {
          title: values.title,
          description: values.description,
          recipeId: values.recipeId,
          ingredients: values.ingredients,
          steps: values.steps,
          video: values.video,
        },
        session!.backendToken,
      );

      if (success) {
        Swal.fire({
          icon: "success",
          title: "Tutorial publicado",
          text: "Tu tutorial se creó correctamente",
        }).then(() => {
          resetForm();
          setVideoPreview(null);
          router.push("/creator/profile?tab=tutorials");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo crear el tutorial",
        });
      }

      setLoading(false);
    },
  });

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Selecciona un archivo de video válido");
      return;
    }

    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }

    formik.setFieldValue("video", file, false);
    formik.setFieldTouched("video", true, false);
    formik.setFieldError("video", undefined);

    setVideoPreview(URL.createObjectURL(file));
  };

  const handleRemoveVideo = () => {
    Swal.fire({
      title: "¿Eliminar video?",
      text: "Deberás subirlo nuevamente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#555",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        if (videoPreview) {
          URL.revokeObjectURL(videoPreview);
        }
        setVideoPreview(null);
        formik.setFieldValue("video", null);
        formik.setFieldTouched("video", true);
      }
    });
  };

  const addIngredient = () => {
    if (!ingredientTitle.trim()) return;

    formik.setFieldValue("ingredients", [
      ...formik.values.ingredients,
      {
        title: ingredientTitle.trim(),
        description: ingredientDescription.trim(),
      },
    ]);

    setIngredientTitle("");
    setIngredientDescription("");
  };

  const removeIngredient = (index: number) => {
    formik.setFieldValue(
      "ingredients",
      formik.values.ingredients.filter((_, i) => i !== index),
    );
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => router.back()}
        className="
      absolute top-0 left-0
      flex items-center gap-2
      text-gray-400 hover:text-orange-400
      transition cursor-pointer
    "
      >
        <ArrowLeftCircleIcon className="w-5 h-5" />
        <span className="text-sm">Volver</span>
      </button>
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Crear nuevo Tutorial
        </h1>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
          {/* VIDEO */}
          <label
            htmlFor="videoInput"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleVideoDrop}
            className="
          flex flex-col items-center justify-center
          w-full h-100
          rounded-xl
          border-2 border-dashed border-white/20
        bg-[#2a221b]
          p-6
        hover:border-orange-400
          transition
          text-center
          gap-2
        "
          >
            {videoPreview ? (
              <div className="relative w-full h-full">
                <button
                  type="button"
                  onClick={handleRemoveVideo}
                  className="
                  absolute top-3 right-3 z-10
                  bg-black/60 hover:bg-red-600
                  text-white p-2 rounded-full
                  transition
                "
                  title="Eliminar video"
                >
                  <Trash2 className="w-4 h-4 cursor-pointer" />
                </button>

                <video
                  src={videoPreview}
                  className="w-full h-full rounded-lg object-cover"
                  controls
                />
              </div>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-orange-500/20 flex items-center justify-center cursor-pointer">
                  <span className="material-symbols-outlined text-3xl text-orange-400 ">
                    cloud_upload
                  </span>
                </div>
                <p className="font-semibold">Cargar Video Principal</p>
                <p className="text-sm text-gray-400">
                  Arrastra y suelta o toca para seleccionar
                </p>
                <p className="text-xs text-gray-500">MP4, MOV hasta 500MB</p>
              </>
            )}

            <input
              id="videoInput"
              type="file"
              accept="video/mp4,video/quicktime"
              onChange={handleVideoChange}
              className="hidden"
            />
          </label>

          {formik.touched.video && formik.errors.video && (
            <p className="text-red-400 text-xs mt-1">{formik.errors.video}</p>
          )}

          <div className="relative">
            <label className="text-sm font-semibold">Receta relacionada</label>

            {/* BOTÓN */}
            <button
              type="button"
              onClick={() => setOpenRecipes(!openRecipes)}
              className="w-full mt-1 flex items-center justify-between rounded-xl bg-[#2a221b] border border-white/10 px-5 py-3 text-sm text-white cursor-pointer focus:outline-none"
            >
              {formik.values.recipeId ? (
                (() => {
                  const selected = userRecipes.find(
                    (r) => r.id === formik.values.recipeId,
                  );
                  return (
                    <div className="flex items-center gap-3">
                      <img
                        src={selected?.imageUrl}
                        alt={selected?.title}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <span>{selected?.title}</span>
                    </div>
                  );
                })()
              ) : (
                <span className="text-gray-400">
                  {loadingRecipes
                    ? "Cargando recetas..."
                    : "Selecciona una receta"}
                </span>
              )}

              <span>▾</span>
            </button>

            {/* LISTA */}
            {openRecipes && (
              <div className="absolute z-20 mt-2 w-full max-h-64 overflow-auto rounded-xl bg-[#2a221b] border border-white/10">
                {userRecipes.map((recipe) => (
                  <button
                    key={recipe.id}
                    type="button"
                    onClick={() => {
                      formik.setFieldValue("recipeId", recipe.id);
                      setOpenRecipes(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition"
                  >
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <span className="text-sm text-white">{recipe.title}</span>
                  </button>
                ))}
              </div>
            )}

            {formik.touched.recipeId && formik.errors.recipeId && (
              <p className="text-red-400 text-xs mt-1">
                {formik.errors.recipeId}
              </p>
            )}
          </div>

          {/* TÍTULO */}
          <div>
            <label className="text-sm font-semibold">Título</label>
            <input
              name="title"
              placeholder="Ej. Cómo hacer pasta fresca casera"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full mt-1 rounded-xl bg-[#2a221b] border border-white/10 px-5 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none"
            />

            {formik.touched.title && formik.errors.title && (
              <p className="text-red-400 text-xs mt-1">{formik.errors.title}</p>
            )}
          </div>

          {/* DESCRIPCIÓN DETALLADA */}
          <div>
            <label className="text-sm font-semibold">
              Descripción detallada
            </label>
            <textarea
              name="description"
              placeholder="Ej. Una guía paso a paso para preparar pasta fresca desde cero..."
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={6}
              className="w-full mt-1 rounded-xl bg-[#2a221b] border border-white/10 px-5 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none"
            />

            {formik.touched.description && formik.errors.description && (
              <p className="text-red-400 text-xs mt-1">
                {formik.errors.description}
              </p>
            )}
          </div>

          {/* INGREDIENTES */}
          <div className="space-y-4">
            {/* Título */}
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-white flex items-center gap-2">
                Ingredientes
              </label>
            </div>

            {/* Lista de ingredientes */}
            {formik.values.ingredients.map((ing, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl bg-[#241c16] border border-white/10 px-4 py-3"
              >
                {/* Icono drag */}

                <span className="text-gray-500 cursor-grab">●</span>

                {/* Texto */}
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{ing.title}</p>
                  {ing.description && (
                    <p className="text-xs text-gray-400">{ing.description}</p>
                  )}
                </div>

                {/* Eliminar */}
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="text-gray-500 hover:text-red-400 transition cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Ingrediente"
                value={ingredientTitle}
                onChange={(e) => setIngredientTitle(e.target.value)}
                className="rounded-lg bg-[#241c16] border border-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-400"
              />

              <input
                placeholder="Cantidad / detalle"
                value={ingredientDescription}
                onChange={(e) => setIngredientDescription(e.target.value)}
                className="rounded-lg bg-[#241c16] border border-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-400"
              />
            </div>

            {/* Botón añadir */}
            <button
              type="button"
              onClick={addIngredient}
              className=" cursor-pointer w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/20 py-4 text-sm text-gray-300 hover:border-orange-400 hover:text-orange-400 transition"
            >
              <span className="text-lg">＋</span>
              Añadir Ingrediente
            </button>

            {typeof formik.errors.ingredients === "string" && (
              <p className="text-red-400 text-xs mt-1">
                {formik.errors.ingredients}
              </p>
            )}
          </div>

          {/* PASOS */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-white flex items-center gap-2">
              Pasos del Tutorial
            </label>

            {/* Lista de pasos */}
            {formik.values.steps.map((step, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-xl bg-[#241c16] border border-white/10 px-4 py-4"
              >
                {/* Número */}
                <span className="text-xs font-bold text-orange-400 mt-1">
                  {index + 1}
                </span>

                {/* Contenido */}
                <div className="flex-1">
                  <p className="text-sm text-white line-clamp-2">
                    {step.description || "Paso sin descripción"}
                  </p>
                </div>

                {/* Acciones */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingStepIndex(index);
                      setStepDraft(step.description);
                    }}
                    className="text-gray-400 hover:text-orange-400 cursor-pointer"
                  >
                    ✎
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      formik.setFieldValue(
                        "steps",
                        formik.values.steps.filter((_, i) => i !== index),
                      )
                    }
                    className="text-gray-400 hover:text-red-400 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            {/* Editor */}
            {editingStepIndex !== null && (
              <div className="rounded-xl bg-[#2a221b] border border-white/10 p-4 space-y-3">
                <label className="text-sm font-semibold text-white">
                  Editar Paso {editingStepIndex + 1}
                </label>

                <textarea
                  value={stepDraft}
                  onChange={(e) => setStepDraft(e.target.value)}
                  placeholder="Escribe el paso aquí..."
                  className="w-full min-h-30 rounded-lg bg-[#241c16] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-400"
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingStepIndex(null);
                      setStepDraft("");
                    }}
                    className="px-4 py-2 text-sm text-gray-400 hover:text-white cursor-pointer"
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const updatedSteps = [...formik.values.steps];
                      updatedSteps[editingStepIndex] = {
                        ...updatedSteps[editingStepIndex],
                        description: stepDraft,
                      };
                      formik.setFieldValue("steps", updatedSteps);
                      setEditingStepIndex(null);
                      setStepDraft("");
                    }}
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-orange-500 hover:bg-orange-600 cursor-pointer"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}

            {/* Añadir nuevo paso */}
            <button
              type="button"
              onClick={() => {
                const newSteps = [...formik.values.steps, { description: "" }];
                formik.setFieldValue("steps", newSteps);
                setEditingStepIndex(newSteps.length - 1);
                setStepDraft("");
              }}
              className="cursor-pointer w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/20 py-4 text-sm text-gray-300 hover:border-orange-400 hover:text-orange-400 transition"
            >
              <span className="text-lg">＋</span>
              Añadir Nuevo Paso
            </button>

            {typeof formik.errors.steps === "string" && (
              <p className="text-red-400 text-xs mt-1">{formik.errors.steps}</p>
            )}
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className={`h-12 rounded-lg font-bold transition
    ${
      loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-orange-500 hover:bg-orange-600 cursor-pointer"
    }`}
          >
            {loading ? "Publicando..." : "Publicar Tutorial"}
          </button>
        </form>
      </div>
    </div>
  );
}
