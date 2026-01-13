"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { TutorialInterface } from "@/interfaces/ITutorial";
import { useSession } from "next-auth/react";

interface TutorialContextProps {
  tutorials: TutorialInterface[];
  userTutorials: TutorialInterface[];
  loading: boolean;
  error: string | null;
  addTutorials: () => Promise<void>;
  fetchMyTutorials?: () => Promise<void>;
  addTutorial?: (data: Partial<TutorialInterface>) => Promise<boolean>;
  updateTutorial?: (
    id: string,
    data: Partial<TutorialInterface>
  ) => Promise<boolean>;
  deleteTutorial?: (id: string) => Promise<void>;
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

  const addTutorials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tutorials`, {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      const json = await res.json();
      setTutorials(json.data ?? json);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error desconocido"
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getTutorialById = useCallback(
    (id: string) => tutorials.find(t => t.id === id),
    [tutorials]
  );

  return (
    <TutorialContext.Provider
      value={{
        tutorials,
        userTutorials,
        loading,
        error,
        addTutorials,
        getTutorialById,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => useContext(TutorialContext);