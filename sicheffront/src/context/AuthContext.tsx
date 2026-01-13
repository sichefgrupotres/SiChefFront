"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react"; // <-- Agregamos useState y useEffect
import { useSession, signOut } from "next-auth/react";
import { AuthSession } from "@/interfaces/IAuth";

interface AuthContextProps {
  dataUser: AuthSession | null;
  setDataUser: (data: AuthSession | null) => void; // <-- 1. Agregamos la definición de la función que faltaba
  isLoadingUser: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [dataUser, setDataUser] = useState<AuthSession | null>(null); // <-- 2. Creamos un estado local para poder modificarlo

  // 3. Este efecto mantiene sincronizada la sesión de NextAuth con nuestro estado local
  useEffect(() => {
    if (session) {
      setDataUser((session as unknown) as AuthSession);
    } else {
      setDataUser(null);
    }
  }, [session]);

  const logout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <AuthContext.Provider
      value={{
        dataUser,      // <-- Usamos el estado local en vez de la sesión directa
        setDataUser,   // <-- 4. Ahora sí exportamos la función que pide el error
        isLoadingUser: status === "loading",
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);