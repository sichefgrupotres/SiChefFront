"use client";
import { userSessionInterface } from "@/interfaces/IUser";
import { useSession } from "next-auth/react";
import { createContext, useState, useEffect, useContext, ReactNode, } from "react";

interface AuthContextProps {
  dataUser: userSessionInterface | null;
  setDataUser: (dataUser: userSessionInterface | null) => void;
  logout: () => void;
  loading: boolean;
  isLoadingUser: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  dataUser: null,
  setDataUser: () => {},
  logout: () => {},
  loading: true,
  isLoadingUser: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [dataUser, setDataUser] = useState<userSessionInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const { data: session, status } = useSession();
   const [user, setUser] = useState<any>(null);

useEffect(() => {
    if (status === "authenticated" && session?.backendToken) {
      // 🔥 GUARDAMOS SOLO EL TOKEN DEL BACKEND
      localStorage.setItem("token", session.backendToken);
      localStorage.setItem("user", JSON.stringify(session.user));

      setUser(session.user);
    }

    if (status === "unauthenticated") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  }, [session, status]);


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

  useEffect(() => {
    // se ejecutara cuando mi dataUser cambie, y lo guardara en el localStorage
    if (dataUser) {
      localStorage.setItem("userSession", JSON.stringify(dataUser));
    }
  }, [dataUser]);

  const logout = () => {
    setDataUser(null);
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem("userSession");
    }
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
