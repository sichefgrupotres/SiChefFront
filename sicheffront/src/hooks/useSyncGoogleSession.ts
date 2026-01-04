"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";

export const useSyncGoogleSession = () => {
  const { data: session, status } = useSession();
  const { setDataUser } = useAuth();

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.backendToken &&
      session?.user
    ) {
      setDataUser({
        token: session.backendToken,
        user: session.user as any, // viene del backend
      });
    }
  }, [status, session, setDataUser]);
};
