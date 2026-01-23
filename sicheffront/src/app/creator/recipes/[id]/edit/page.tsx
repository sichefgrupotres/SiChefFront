"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useRecipe } from "@/context/RecipeContext";

export default function CreatorRecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { updateRecipe } = useRecipe();

  const [recipe, setRecipe] = useState<any>(null);
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`
        );

        if (res.status === 404) {
          router.push("/404");
          return;
        }

        if (!res.ok) throw new Error();

        const data = await res.json();
        setRecipe(data);
        setForm(data);
      } catch {
        Swal.fire("Error", "No se pudo cargar la receta", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, router]);

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const toggleCategory = (category: string) => {
    setForm((prev: any) => {
      const exists = prev.category.includes(category);

      return {
        ...prev,
        category: exists
          ? prev.category.filter((c: string) => c !== category)
          : [...prev.category, category],
      };
    });
  };

  const categoriesList = [
    { name: "Desayunos", image: "/categories/desayuno.jpg" },
    { name: "Almuerzos", image: "/categories/almuerzo.jpg" },
    { name: "Meriendas", image: "/categories/merienda.jpg" },
    { name: "Cenas", image: "/categories/cena.jpg" },
    { name: "Postres", image: "/categories/postres.jpg" },
  ];

  const handleSave = async () => {
    const result = await Swal.fire({
      title: "¿Guardar cambios?",
      text: "Se actualizará la información de la receta",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      setSaving(true);

      const payload = {
        title: form.title,
        description: form.description,
        ingredients: form.ingredients,
        difficulty: form.difficulty,
        category: form.category,
        isPremium: form.isPremium,
      };

      const response = await updateRecipe(id, payload);
      if (!response) throw new Error();

      if (response.statusPost === "BLOCKED") {
        await Swal.fire({
          icon: "warning",
          title: "No se pudo actualizar la receta",
          text:
            response.message ||
            "El contenido contiene lenguaje inapropiado y no cumple con nuestras normas.",
        });
        return;
      }

      if (response.statusPost === "NEEDS_REVIEW") {
        await Swal.fire({
          icon: "warning",
          title: "Actualización pendiente de revisión",
          text:
            response.message ||
            "La receta contiene contenido sensible y será revisada antes de publicarse.",
        });
      }

      if (response.statusPost === "SAFE") {
        await Swal.fire({
          icon: "success",
          title: "Receta actualizada",
          text: response.message,
        });
      }

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}/image`,
          { method: "PATCH", body: formData }
        );

        if (!res.ok) throw new Error("Error al subir imagen");

        const imgData = await res.json();
        payload["imageUrl"] = imgData.imageUrl;
      }

      setRecipe({ ...recipe, ...payload });
      setEditMode(false);
      setImageFile(null);
      setPreview(null);

      router.push(`/creator/recipes/${id}`);
    } catch {
      Swal.fire("Error", "No se pudo guardar", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-white">
        Cargando receta...
      </div>
    );
  }

  if (!recipe || !form) return null;

  return (
    <div className="max-w-3xl mx-auto text-white space-y-6">
      {/* Imagen */}
      <div className="relative">
        <img
          src={preview || form.imageUrl}
          className="w-full h-64 object-cover rounded-xl"
          alt={form.title}
        />

        {editMode && (
          <label className="inline-block mt-3 cursor-pointer bg-orange-500 px-4 py-2 rounded">
            Cambiar foto
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleImageSelect(e.target.files[0]);
                }
              }}
            />
          </label>
        )}
      </div>

      {/* Título */}
      {editMode ? (
        <input
          className="w-full p-2 rounded bg-[#2a221b] text-white text-xl font-bold border border-white/20"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      ) : (
        <h1 className="text-3xl font-bold">{recipe.title}</h1>
      )}

      {/* Descripción */}
      {editMode ? (
        <textarea
          className="w-full p-2 rounded bg-[#2a221b] text-white border border-white/20"
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      ) : (
        <p className="text-white/90">{recipe.description}</p>
      )}

      {/* Ingredientes */}
      {editMode ? (
        <textarea
          className="w-full p-2 rounded bg-[#2a221b] text-white border border-white/20"
          rows={4}
          value={form.ingredients}
          onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
        />
      ) : (
        <p className="text-white/80 whitespace-pre-line">
          {recipe.ingredients}
        </p>
      )}

      {/* Categorías */}
      <div>
        <p className="mb-2 font-semibold">Categorías</p>

        {editMode ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categoriesList.map((cat) => (
              <label
                key={cat.name}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer border
            ${
              form.category.includes(cat.name)
                ? "border-orange-500 bg-orange-500/20"
                : "border-white/20"
            }`}>
                <input
                  type="checkbox"
                  className="accent-orange-500"
                  checked={form.category.includes(cat.name)}
                  onChange={() => toggleCategory(cat.name)}
                />
                <span className="text-white">{cat.name}</span>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-white/80">
            <b>Categorías:</b> {recipe.category.join(", ")}
          </p>
        )}
      </div>

      {/* Dificultad */}
      {editMode ? (
        <select
          className="p-2 rounded bg-[#2a221b] text-white border border-white/20"
          value={form.difficulty}
          onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
          <option value="facil">Fácil</option>
          <option value="medio">Medio</option>
          <option value="dificil">Difícil</option>
        </select>
      ) : (
        <p className="capitalize">
          <b>Dificultad:</b> {recipe.difficulty}
        </p>
      )}

      {/* Botones */}
      <div className="flex gap-3 pt-4">
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="bg-orange-500 px-4 py-2 rounded">
            Editar receta
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 px-4 py-2 rounded">
              {saving ? "Guardando..." : "Guardar"}
            </button>

            <button
              onClick={() => {
                setForm(recipe);
                setEditMode(false);
                setPreview(null);
                setImageFile(null);
              }}
              className="bg-gray-600 px-4 py-2 rounded">
              Cancelar
            </button>
          </>
        )}

        <button
          onClick={() => router.push("/creator/profile")}
          className="ml-auto underline">
          Volver
        </button>
      </div>
    </div>
  );
}
