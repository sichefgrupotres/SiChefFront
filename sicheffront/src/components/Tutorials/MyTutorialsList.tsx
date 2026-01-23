"use client";

import { useEffect } from "react";
import { useTutorial } from "@/context/TutorialContext";
import TutorialCard from "./CardTutorial";
import router from "next/router";
import Swal from "sweetalert2";

export default function MyTutorialsList() {
  const {
    userTutorials,
    fetchMyTutorials,
    loading,
    error,
    tutorials,
    deleteTutorial,
  } = useTutorial();

  interface Tutorial {
    id: string;
    video: string;
    title: string;
    description: string;
    category: string[];
    difficulty: string;
    createdAt: string;
  }

  useEffect(() => {
    fetchMyTutorials();
  }, [fetchMyTutorials]);

  useEffect(() => {}, [userTutorials, loading, error]);

  if (loading) {
    return <p className="text-white">Cargando tutoriales...</p>;
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={fetchMyTutorials}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
          Reintentar
        </button>
      </div>
    );
  }

  if (!userTutorials || userTutorials.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p>No tenés tutoriales todavía</p>
      </div>
    );
  }

  const handleDeleteTutorial = async (id: string) => {
    const confirmed = await Swal.fire({
      title: "¿Eliminar tutorial?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirmed.isConfirmed) return;

    const ok = await deleteTutorial?.(id);

    if (ok) {
      await Swal.fire(
        "Eliminado",
        "El tutorial fue eliminado correctamente",
        "success"
      );
    } else {
      await Swal.fire("Error", "No se pudo eliminar el tutorial", "error");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 w-full">
      {userTutorials.map((tutorial) => (
        <TutorialCard
          key={tutorial.id}
          tutorial={tutorial}
          mode="creator"
          onEdit={(id) => router.push(`/creator/tutorials/${id}/edit`)}
          onDelete={(id) => handleDeleteTutorial(id)}
        />
      ))}
    </div>
  );
}
