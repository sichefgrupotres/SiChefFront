"use client";
import {
  initialValuesRegister,
  RegisterFormValuesInterface,
  RegisterSchema,
} from "@/validators/RegisterSchema";
import { registerUserService } from "@/services/auth.services";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { GoogleAuthButton } from "../Buttons/GoogleAuthButton";

const RegisterForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data: session } = useSession();

  const formik = useFormik<RegisterFormValuesInterface>({
    initialValues: initialValuesRegister,
    validationSchema: RegisterSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = { ...values };

        if (!payload.roleId) {
          delete payload.roleId;
        }

        const response = await registerUserService(payload);
        router.push("/login");
        resetForm();
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    /* Contenedor principal con la imagen de fondo */
    <div className="relative min-h-screen w-full flex items-center justify-center">
      <Image
        src="/Registerbackground.png" // Asegúrate de que el nombre coincida con el archivo en tu carpeta public
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
          <h1 className="text-white text-[28px] font-bold pt-4">
            Sumate a nuestra comunidad
          </h1>
          <p className="text-white text-base pt-1">
            Completa los datos para registrarte
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={formik.handleSubmit} className="space-y-4 text-black">
          {/* Nombre + Apellido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-white text-sm mb-1">Nombre</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white">
                  badge
                </span>
                <input
                  type="text"
                  name="name"
                  placeholder="Tu nombre"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-[#2a221b] text-white h-12 rounded-lg pl-12 pr-4 w-full border border-transparent focus:border-[#F57C00] outline-none"
                />
              </div>
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-400 text-xs mt-1">{formik.errors.name}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-white text-sm mb-1">Apellido</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white">
                  person
                </span>
                <input
                  type="text"
                  name="lastname"
                  placeholder="Tu apellido"
                  value={formik.values.lastname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-[#2a221b] text-white h-12 rounded-lg pl-12 pr-4 w-full border border-transparent focus:border-[#F57C00] outline-none"
                />
              </div>
              {formik.touched.lastname && formik.errors.lastname && (
                <p className="text-red-400 text-xs mt-1">{formik.errors.lastname}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-white text-sm mb-1">Email</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white">
                mail
              </span>
              <input
                type="email"
                name="email"
                placeholder="Introduce tu email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-[#2a221b] text-white h-12 rounded-lg px-4 pl-12 w-full border border-transparent focus:border-[#F57C00] outline-none"
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-400 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password */}
            <div className="flex flex-col">
              <label className="text-white text-sm mb-1">Contraseña</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-white text-[15px]">
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Contraseña"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-[#2a221b] text-white h-12 rounded-lg px-4 pl-10 pr-10 w-full placeholder:text-sm border border-transparent focus:border-[#F57C00] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {/* Mensaje de error agregado */}
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-400 text-xs mt-1">{formik.errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col">
              <label className="text-white text-sm mb-1">Confirmar</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white text-[15px]">
                  lock_reset
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirmar"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-[#2a221b] text-white h-12 rounded-lg px-4 pl-10 pr-10 w-full placeholder:text-sm border border-transparent focus:border-[#F57C00] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {/* Mensaje de error agregado */}
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">{formik.errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Rol */}
          <div className="flex flex-col">
            <label className="text-white text-sm mb-1">Rol</label>
            <select
              name="roleId"
              value={formik.values.roleId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="bg-[#2a221b] text-white h-12 rounded-lg px-4 border border-transparent focus:border-[#F57C00] outline-none"
            >
              <option value="">Seleccionar</option>
              <option value="USER">Usuario</option>
              <option value="CREATOR">Creador</option>
            </select>
            {/* Mensaje de error agregado */}
            {formik.touched.roleId && formik.errors.roleId && (
              <p className="text-red-400 text-xs mt-1">{formik.errors.roleId}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className={`w-full h-14 rounded-lg text-white font-bold transition-all mt-4
            ${formik.isSubmitting ? "bg-[#F57C00]/50 cursor-not-allowed" : "bg-[#F57C00] hover:scale-105 cursor-pointer"}`}
          >
            {formik.isSubmitting ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center py-4">
          <div className="grow border-t border-gray-600"></div>
          <span className="mx-4 text-white text-sm">¿Ya tienes cuenta?</span>
          <div className="grow border-t border-gray-600"></div>
        </div>

        <button
          type="button"
          className="w-full h-14 rounded-lg bg-[#FFF3E0] text-[#F57C00] text-lg font-bold border border-[#F57C00]/50 transition-transform duration-200 hover:scale-105 cursor-pointer"
          onClick={() => router.push("/login")}
        >
          Iniciar Sesion
        </button>

        {/* Google Auth Section */}
        <div className="relative flex items-center py-4">
          <div className="grow border-t border-gray-600"></div>
          <span className="shrink mx-4 text-white text-sm">O continuar con</span>
          <div className="grow border-t border-gray-600"></div>
        </div>

        <div className="flex items-center justify-center gap-12">
          <div className="flex flex-col items-center gap-2">
            <GoogleAuthButton roleIntent="USER" />
            <span className="text-xs font-bold text-white">USUARIO</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <GoogleAuthButton roleIntent="CREATOR" />
            <span className="text-xs font-bold text-white">CREADOR</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 pt-6">
          <p>
            Al continuar, aceptas nuestros{" "}
            <span className="underline cursor-pointer">Términos</span> y{" "}
            <span className="underline cursor-pointer">Privacidad</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;