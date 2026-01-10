"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSession, signOut } from "next-auth/react";
import { AuthSession } from "@/interfaces/IAuth";

interface AuthContextProps {
  dataUser: AuthSession | null;
  isLoadingUser: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();

  const logout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <AuthContext.Provider
      value={{
        dataUser: session as AuthSession | null,
        isLoadingUser: status === "loading",
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
