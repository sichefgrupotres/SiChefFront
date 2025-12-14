"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Role = "CREATOR" | "USER";
export type Genero = "masculino" | "femenino" | "no_binario"| "no_responder"

export interface RegisterFormData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  confirmPassword: string;
  cumpleaños: string;
  genero: Genero;
  nacionalidad: string;
  ciudad: string;
  paisDeResidencia: string;
  avatarUrl: string;
  role: Role;
}

interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    fetch("http://localhost:3000/auth/me", {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setUser(data.user);
        setToken(storedToken);
      })
      .catch(() => localStorage.removeItem("token"));
  }, []);

  const register = async (data: RegisterFormData) => {
    const res = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Error en registro");

    const result = await res.json();
    setUser(result.user);
    setToken(result.token);
    localStorage.setItem("token", result.token);
  };

  const login = async (email: string, password: string) => {
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Credenciales inválidas");

    const result = await res.json();
    setUser(result.user);
    setToken(result.token);
    localStorage.setItem("token", result.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};
