"use client";

import { useEffect } from "react";
import TutorialCard from "@/components/Tutorials/CardTutorial";
import { useSession } from "next-auth/react";
import { useTutorial } from "@/context/TutorialContext";

export default function MyTutorialsList() {
  const { userTutorials, fetchMyTutorials, loading, error } = useTutorial();
  const { status } = useSession();
  useEffect(() => {
    if (status === "authenticated") {
      fetchMyTutorials();
    }
  }, [status]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Cargando tutoriales...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
      {!userTutorials || userTutorials.length === 0 ? (
        <p className="text-white col-span-full text-center">
          Aún no has creado tutoriales.
        </p>
      ) : (
        userTutorials.map((tutorial) => (
          <TutorialCard key={tutorial.id} tutorial={tutorial} />
        ))
      )}
    </div>
  );
}
