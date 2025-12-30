"use client";
import { userSessionInterface } from "@/interfaces/IUser";
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
