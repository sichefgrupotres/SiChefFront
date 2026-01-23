"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { TutorialInterface } from "@/interfaces/ITutorial";
import { useSession } from "next-auth/react";

interface TutorialContextProps {
  tutorials: TutorialInterface[];
  userTutorials: TutorialInterface[];
  loading: boolean;
  error: string | null;
  fetchMyTutorials: () => Promise<void>;
  addTutorial: (data: Partial<TutorialInterface>) => Promise<boolean>;
  updateTutorial?: (
    id: string,
    data: Partial<TutorialInterface>
  ) => Promise<boolean>;
  deleteTutorial?: (id: string) => Promise<boolean>;
  getTutorialById: (id: string) => TutorialInterface | undefined;
}

const TutorialContext = createContext<TutorialContextProps>(
  {} as TutorialContextProps
);

interface TutorialProviderProps {
  children: React.ReactNode;
}

export const TutorialProvider = ({ children }: TutorialProviderProps) => {
  const { data: session } = useSession();
  const token = session?.backendToken;

  const [tutorials, setTutorials] = useState<TutorialInterface[]>([]);
  const [userTutorials, setUserTutorials] = useState<TutorialInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyTutorials = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const url = `${process.env.NEXT_PUBLIC_API_URL}/tutorials/my-tutorials`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}`);
      }

      const json = await res.json();

      setUserTutorials(json.data ?? json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [token]);
  const addTutorial = async (
    data: Partial<TutorialInterface>
  ): Promise<boolean> => {
    if (!token) return false;

    try {
      const formData = new FormData();

      formData.append("title", data.title ?? "");
      formData.append("description", data.description ?? "");
      if (data.recipeId) formData.append("recipeId", data.recipeId);

      if (data.video) {
        formData.append("video", data.video as File);
      }

      formData.append("ingredients", JSON.stringify(data.ingredients ?? []));
      formData.append("steps", JSON.stringify(data.steps ?? []));

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tutorials`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) return false;

      const json = await res.json();

      setUserTutorials((prev) => [...prev, json.data]);

      return true;
    } catch (error) {
      console.error("Error creando tutorial:", error);
      return false;
    }
  };

  const deleteTutorial = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tutorials/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error();

      setTutorials((prev) => prev.filter((t) => t.id !== id));
      setUserTutorials((prev) => prev.filter((t) => t.id !== id));
      return true;
    } catch (error) {
      console.error("Error al eliminar tutorial", error);
      return false;
    }
  };

  const getTutorialById = useCallback(
    (id: string) => tutorials.find((t) => t.id === id),
    [tutorials]
  );

  return (
    <TutorialContext.Provider
      value={{
        tutorials,
        userTutorials,
        loading,
        error,
        fetchMyTutorials,
        addTutorial,
        getTutorialById,
        deleteTutorial,
      }}>
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => useContext(TutorialContext);
