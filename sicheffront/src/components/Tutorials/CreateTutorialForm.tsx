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
import { ArrowLeftCircleIcon, Trash2 } from "lucide-react";
import { useRecipe } from "@/context/RecipeContext";

export default function NewTutorial() {
  const router = useRouter();
  const { data: session } = useSession();
  const { userRecipes, loading: loadingRecipes } = useRecipe();

  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [openRecipes, setOpenRecipes] = useState(false);

  const handleVideoDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Selecciona un archivo de video válido");
      return;
    }

    if (videoPreview) URL.revokeObjectURL(videoPreview);

    formik.setFieldValue("video", file, false);
    formik.setFieldTouched("video", true, false);
    formik.setFieldError("video", undefined);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Selecciona un archivo de video válido");
      return;
    }

    if (videoPreview) URL.revokeObjectURL(videoPreview);

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
        if (videoPreview) URL.revokeObjectURL(videoPreview);
        setVideoPreview(null);
        formik.setFieldValue("video", null);
        formik.setFieldTouched("video", true);
      }
    });
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
          video: values.video,
          ingredients: [],
          steps: [],
        },
        session!.backendToken
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

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => router.back()}
        className="absolute top-0 left-0 flex items-center gap-2 text-gray-400 hover:text-orange-400 transition cursor-pointer">
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
            className="flex flex-col items-center justify-center w-full h-100 rounded-xl border-2 border-dashed border-white/20 bg-[#2a221b] p-6 hover:border-orange-400 transition text-center gap-2">
            {videoPreview ? (
              <div className="relative w-full h-full">
                <button
                  type="button"
                  onClick={handleRemoveVideo}
                  className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-red-600 text-white p-2 rounded-full transition"
                  title="Eliminar video">
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
                  <span className="material-symbols-outlined text-3xl text-orange-400">
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

          {/* RECETA RELACIONADA */}
          <div className="relative">
            <label className="text-sm font-semibold">Receta relacionada</label>
            <button
              type="button"
              onClick={() => setOpenRecipes(!openRecipes)}
              className="w-full mt-1 flex items-center justify-between rounded-xl bg-[#2a221b] border border-white/10 px-5 py-3 text-sm text-white cursor-pointer focus:outline-none">
              {formik.values.recipeId ? (
                (() => {
                  const selected = userRecipes.find(
                    (r) => r.id === formik.values.recipeId
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
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition">
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
              placeholder="Ej. titulo del video tutorial..."
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full mt-1 rounded-xl bg-[#2a221b] border border-white/10 px-5 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none"
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-red-400 text-xs mt-1">{formik.errors.title}</p>
            )}
          </div>

          {/* DESCRIPCIÓN */}
          <div>
            <label className="text-sm font-semibold">
              Descripción detallada
            </label>
            <textarea
              name="description"
              placeholder="Ej. Descripcion de lo que contiene el video tutorial..."
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

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className={`h-12 rounded-lg font-bold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 cursor-pointer"
            }`}>
            {loading ? "Publicando..." : "Publicar Tutorial"}
          </button>
        </form>
      </div>
    </div>
  );
}
