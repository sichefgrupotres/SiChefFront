"use client";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export const GoogleAuthButton = ({ roleIntent }: { roleIntent: "USER" | "CREATOR" }) => {
  const router = useRouter();
  const { setDataUser } = useAuth();

  const handleAuth = async () => {
    // 1. Iniciar Google
    const result = await signIn("google", { redirect: false });

    if (result?.ok) {
      const session = await getSession();
      if (session?.user) {
        try {
          // 2. Llamada a tu backend (NestJS findOrCreate)
          const response = await fetch("http://localhost:3001/auth/register-google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: session.user.email,
              name: session.user.name?.split(" ")[0] || "USER",
              lastname: session.user.name?.split(" ").slice(1).join(" ") || "",
              googleId: (session.user as any).id || (session as any).sub,
              roleId: roleIntent,
            }),
          });

          const data = await response.json();

          if (response.ok && data.token) {
            // 3. GUARDAR TOKEN EN LOCALSTORAGE (Crucial para tus servicios)
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user || data));
            
            setDataUser(data.user || data);

            // 4. Redirigir según el rol que devuelva el BACKEND
            const finalRole = data.user?.roleId || data.roleId;
            router.push(finalRole === "CREATOR" ? "/creator" : "/guest");
          }
        } catch (error) {
          console.error("Error en autenticación Google:", error);
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
