"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

interface GoogleAuthButtonProps {
  roleIntent: "USER" | "CREATOR"; // El rol que queremos asignar
}

export const GoogleAuthButton = ({ roleIntent }: GoogleAuthButtonProps) => {
  const router = useRouter();
  const { setDataUser } = useAuth();

  const handleAuth = async () => {
    // 1. Guardar la intención en una Cookie (dura 10 min)
    document.cookie = `intended_role=${roleIntent}; path=/; max-age=600; SameSite=Lax`;

    // 2. Iniciar Google
    const result = await signIn("google", { redirect: false });

    if (result?.ok) {
      const { getSession } = await import("next-auth/react");
      const currentSession = await getSession();

      if (currentSession?.user) {
        try {
          // 3. Registro en Backend (Sin enviar 'role' para evitar el error 400)
          const response = await fetch("http://localhost:3001/auth/register-google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: currentSession.user.email,
              name: currentSession.user.name,
              googleId: (currentSession.user as any).id || (currentSession as any).sub,
            }),
          });

          const data = await response.json();

          if (response.ok) {
            // 4. Recuperar el rol de la cookie
            const savedRole = document.cookie
              .split("; ")
              .find((row) => row.startsWith("intended_role="))
              ?.split("=")[1] || "USER";

            // 5. Sincronizar Contexto con el rol de la cookie
            const sessionData = {
              ...data, 
              role: savedRole, // Aplicamos el rol que guardamos antes de ir a Google
            };

            setDataUser(sessionData);
            localStorage.setItem("userSession", JSON.stringify(sessionData));

            // 6. Limpiar cookie y redirigir
            document.cookie = "intended_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            router.push(savedRole === "CREATOR" ? "/creator" : "/home");
          }
        } catch (error) {
          console.error("Error en el flujo de autenticación", error);
        }
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleAuth}
      className="flex items-center justify-center w-14 h-14 bg-[#543C2A] rounded-full transition-transform duration-200 hover:scale-110"
    >
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path
          d="M21.805 10.038C21.925 10.686 22 11.35 22 12C22 17.523 17.523 22 12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C14.706 2 17.11 3.09 18.84 4.88L15.342 8.378C14.398 7.493 13.28 7 12 7C9.239 7 7 9.239 7 12C7 14.761 9.239 17 12 17C14.398 17 16.327 15.34 16.839 13.195H12V10H21.805V10.038Z"
          fill="#D2B48C"
        />
      </svg>
    </button>
  );
};