"use client";
import { useFormik } from "formik";
import {
  initialValuesLogin,
  LoginFormValuesInterface,
  LoginSchema,
} from "@/validators/LoginSchema";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";

const LoginForm = () => {
  const router = useRouter();
  const { setDataUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik<LoginFormValuesInterface>({
    initialValues: initialValuesLogin,
    validationSchema: LoginSchema,
    onSubmit: async (values, { resetForm }) => {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/creator");
        resetForm();
      } else {
        console.error("Login inválido");
      }
    },
  });

  const handleGoogleLogin = () => {
    signIn("google", {
      callbackUrl: "/creator",
    });
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      <Image
        src="/Loginbackground.png" // Asegúrate de que el nombre coincida con el archivo en tu carpeta public
        alt="Background Kitchen"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay oscuro para legibilidad */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Contenedor del Formulario */}
      <div className="relative z-10 w-full max-w-lg p-8 bg-[#181411]/90 rounded-2xl shadow-2xl my-10 mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="material-symbols-outlined text-[#F57C00] text-4xl!">
            Si Chef! skillet
          </span>
          <h1 className="text-white text-[28px] font-bold pt-4">Bienvenido</h1>
          <p className="text-white text-base pt-1">
            ¡Qué alegría nos da volver a verte aquí! 🧡
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* EMAIL */}
          <div className="flex flex-col">
            <label className="text-white text-sm mb-2 ml-1 font-medium">
              Email
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/60">
                mail
              </span>
              <input
                type="email"
                name="email"
                placeholder="Introduce tu email"
                value={formik.values.email}
                onChange={formik.handleChange}
                className="bg-[#2a221b] text-white h-14 rounded-lg pl-12 pr-4 w-full border border-white/10 focus:border-[#F57C00] outline-none transition-colors"
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-400 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col">
            <label className="text-white text-sm mb-2 ml-1 font-medium">
              Contraseña
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/60">
                lock
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Introduce tu contraseña"
                value={formik.values.password}
                onChange={formik.handleChange}
                className="bg-[#2a221b] text-white h-14 rounded-lg pl-12 pr-12 w-full border border-white/10 focus:border-[#F57C00] outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-400 text-xs mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* Forgot password */}
          <div className="flex justify-end mt-[-10px]">
            <p className="text-white/60 text-sm underline cursor-pointer hover:text-white transition-colors">
              Olvidé mi contraseña
            </p>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className={`w-full h-14 rounded-lg text-lg font-bold text-white transition-all mt-4 
              ${
                !(formik.isValid && formik.dirty && !formik.isSubmitting)
                  ? "bg-[#F57C00]/50 cursor-not-allowed"
                  : "bg-[#F57C00] hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#F57C00]/20 cursor-pointer"
              }`}>
            {formik.isSubmitting ? "Iniciando Sesión..." : "Entrar"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center py-8">
          <div className="grow border-t border-white/10"></div>
          <span className="mx-4 text-white/60 text-sm">
            ¿No tienes cuenta aún?
          </span>
          <div className="grow border-t border-white/10"></div>
        </div>

        {/* Botón de Registro */}
        <button
          type="button"
          className="w-full h-14 rounded-lg bg-[#FFF3E0] text-[#F57C00] text-lg font-bold border border-[#F57C00]/50 transition-transform duration-200 hover:scale-105 cursor-pointer"
          onClick={() => router.push("/register")}>
          Regístrate
        </button>

        {/* Divider Google */}
        {/* <div className="relative flex items-center py-8">
          <div className="grow border-t border-white/10"></div>
          <span className="shrink mx-4 text-white/60 text-sm">O continuar con</span>
          <div className="grow border-t border-white/10"></div>
        </div> */}

        {/* Google Button */}
        {/* <div className="flex items-center justify-center">
          <button
            type="button"
            className="group flex items-center justify-center w-14 h-14 bg-orange-500/10 rounded-full border border-orange-500/30 transition-all hover:scale-110 hover:bg-orange-500/20"
            onClick={handleGoogleLogin}
          >
            <svg
              className="w-6 h-6 transition-transform group-hover:rotate-12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.805 10.038C21.925 10.686 22 11.35 22 12C22 17.523 17.523 22 12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C14.706 2 17.11 3.09 18.84 4.88L15.342 8.378C14.398 7.493 13.28 7 12 7C9.239 7 7 9.239 7 12C7 14.761 9.239 17 12 17C14.398 17 16.327 15.34 16.839 13.195H12V10H21.805V10.038Z"
                fill="#F57C00"
              />
            </svg>
          </button>
        </div> */}

        {/* Footer */}
        <div className="text-center text-xs text-white/40 pt-10">
          <p>
            Al continuar, aceptas nuestros{" "}
            <span className="underline cursor-pointer hover:text-white">
              Términos
            </span>{" "}
            y{" "}
            <span className="underline cursor-pointer hover:text-white">
              Privacidad
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
