"use client";
import { useSyncGoogleSession } from "@/hooks/useSyncGoogleSession";
import { AuthSession } from "@/interfaces/IAuth";
import { userSessionInterface } from "@/interfaces/IUser";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";

interface AuthContextProps {
  dataUser: AuthSession | null;
  setDataUser: (dataUser: AuthSession | null) => void;
  logout: () => void;
  loading: boolean;
  isLoadingUser: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  dataUser: null,
  setDataUser: () => { },
  logout: () => { },
  loading: true,
  isLoadingUser: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [dataUser, setDataUser] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  useSyncGoogleSession();
  useEffect(() => {
    // se ejecutara cuando mi dataUser cambie, y lo guardara en el localStorage
    if (dataUser) {
      localStorage.setItem("userSession", JSON.stringify(dataUser));
    }
    if (dataUser?.token) {
      localStorage.setItem("token", dataUser.token);
    }
  }, [dataUser]);

  useEffect(() => {
    //se encarga de extraer la informacion del localStorage cuando se recarga la pagina y almacenar en el estado
    if (typeof window !== "undefined" && window.localStorage) {
      const userInfo = localStorage.getItem("userSession");
      if (userInfo) {
        setDataUser(JSON.parse(userInfo));
      }
    }
    setLoading(false);
    setIsLoadingUser(false);
  }, []);

  const logout = async () => {
    setDataUser(null);
    localStorage.removeItem("userSession");
    localStorage.removeItem("token");

    await signOut({
      callbackUrl: "/login",
    });

  };
  return (
    <AuthContext.Provider
      value={{ dataUser, setDataUser, logout, loading, isLoadingUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
