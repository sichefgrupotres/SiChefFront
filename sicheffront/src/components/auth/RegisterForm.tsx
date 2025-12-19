"use client";
import {
  initialValuesRegister,
  RegisterFormValuesInterface,
  RegisterSchema,
} from "@/validators/RegisterSchema";
import { registerUserService } from "@/services/aut.services";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";

const RegisterForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

        console.log("formulario enviado", response);
        console.log(payload);

        router.push("/login");
        resetForm();
      } catch (error) {
        console.error(error);
      }
    },
  });
  return (
    <div className="min-h-screen bg-[#3D2B1F]">
      <div className="min-h-screen max-w-6xl mx-auto flex flex-col md:flex-row items-center px-6 md:px-12">
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-full max-w-md space-y-8 py-10">
            {/* Header */}
            <div className="text-center">
              <span className="material-symbols-outlined text-[#F57C00] text-5xl!">
                Si Chef! skillet
              </span>
              <h1 className="text-white text-[32px] font-bold pt-4">
                Sumate a nuestra comunidad
              </h1>
              <p className="text-white text-base pt-1">
                Completa los datos para registrarte
              </p>
            </div>

            {/* FORM */}
            <form
              onSubmit={formik.handleSubmit}
              className="space-y-4 text-black">
              {/* Nombre + Apellido */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div className="flex flex-col">
                  <label className="text-white">Nombre</label>

                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#D2B48C]">
                      badge
                    </span>

                    <input
                      type="text"
                      name="name"
                      placeholder="Tu nombre"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="bg-[#543C2A] text-white h-12 rounded-lg pl-12 pr-4 w-full"
                    />
                  </div>

                  {formik.touched.name && formik.errors.name && (
                    <p className="text-red-400 text-sm">{formik.errors.name}</p>
                  )}
                </div>

                {/* Apellido */}
                <div className="flex flex-col">
                  <label className="text-white">Apellido</label>

                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#D2B48C]">
                      person
                    </span>

                    <input
                      type="text"
                      name="lastname"
                      placeholder="Tu apellido"
                      value={formik.values.lastname}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="bg-[#543C2A] text-white h-12 rounded-lg pl-12 pr-4 w-full"
                    />
                  </div>

                  {formik.touched.lastname && formik.errors.lastname && (
                    <p className="text-red-400 text-sm">
                      {formik.errors.lastname}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label className="text-white">Email</label>

                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#D2B48C]">
                    mail
                  </span>

                  <input
                    type="email"
                    name="email"
                    placeholder="Introduce tu email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="bg-[#543C2A] text-white h-12 rounded-lg px-4 pl-12 w-full"
                  />
                </div>

                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-400 text-sm">{formik.errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password */}
                <div className="flex flex-col">
                  <label className="text-white">Contraseña</label>

                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-[#D2B48C] text-[15px]">
                      lock
                    </span>

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Ingresa tu contraseña"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="bg-[#543C2A] text-white h-12 rounded-lg px-4 pl-12 pr-10 w-full placeholder:text-sm"
                    />

                    {/* 👁 OJITO */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D2B48C] hover:text-white cursor-pointer "
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  {formik.touched.password && formik.errors.password && (
                    <p className="text-red-400 text-sm">
                      {formik.errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col">
                  <label className="text-white">Confirmar contraseña</label>

                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#D2B48C] text-[15px]">
                      lock_reset
                    </span>

                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirma tu contraseña"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="bg-[#543C2A] text-white h-12 rounded-lg px-4 pl-12 pr-10 w-full placeholder:text-sm "
                    />

                    {/* 👁 OJITO */}
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D2B48C] hover:text-white cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={15} />
                      ) : (
                        <Eye size={15} />
                      )}
                    </button>
                  </div>

                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <p className="text-red-400 text-sm">
                        {formik.errors.confirmPassword}
                      </p>
                    )}
                </div>
              </div>

              {/* Rol */}
              <div className="flex flex-col">
                <label className="text-white">Rol</label>
                <select
                  name="roleId"
                  value={formik.values.roleId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-[#543C2A] text-white h-12 rounded-lg px-4"
                >
                  <option value="">Seleccionar</option>
                  <option value="USER">Usuario</option>
                  <option value="CREATOR">Creador</option>
                </select>
                {formik.touched.roleId && formik.errors.roleId && (
                  <p className="text-red-400 ">{formik.errors.roleId}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
               disabled={formik.isSubmitting}
                className={`w-full h-14 rounded-lg text-white font-bold transition-all cursor-pointer
            ${
              formik.isSubmitting
                ? "bg-[#F57C00]/50 cursor-not-allowed"
                : "bg-[#F57C00] hover:scale-105"
            }
          `}>
                {formik.isSubmitting ? "Registrando..." : "Registrarse"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center py-4">
              <div className="grow border-t border-gray-600"></div>
              <span className="mx-4 text-[#D2B48C] text-sm">
                ¿Ya tienes cuenta?
              </span>
              <div className="grow border-t border-gray-600"></div>
            </div>

            <button
              type="button"
              className="w-full h-14 rounded-lg bg-[#FFF3E0] text-[#F57C00] text-lg font-bold border border-[#F57C00]/50 transition-transform duration-200 hover:scale-105 hover:bg-[#FFE0B2]"
              onClick={() => router.push("/login")}>
              Iniciar Sesion
            </button>

            {/* Divider Google */}
            <div className="relative flex items-center py-4">
              <div className="grow border-t border-gray-600"></div>
              <span className="shrink mx-4 text-[#D2B48C] text-sm">
                O continuar con
              </span>
              <div className="grow border-t border-gray-600"></div>
            </div>

            {/* Google */}
            <div className="flex items-center justify-center">
              <button
                type="button"
                className="flex items-center justify-center w-14 h-14 bg-[#543C2A] rounded-full transition-transform duration-200 hover:scale-110"
                onClick={() => signIn("google")}>
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  >
                  <path
                    d="M21.805 10.038C21.925 10.686 22 11.35 22 12C22 17.523 17.523 22 12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C14.706 2 17.11 3.09 18.84 4.88L15.342 8.378C14.398 7.493 13.28 7 12 7C9.239 7 7 9.239 7 12C7 14.761 9.239 17 12 17C14.398 17 16.327 15.34 16.839 13.195H12V10H21.805V10.038Z"
                    fill="#D2B48C"
                  />
                </svg>
              </button>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-400 pt-2">
              <p>
                Al continuar, aceptas nuestros{" "}
                <span className="underline cursor-pointer">Términos</span> y{" "}
                <span className="underline cursor-pointer">Privacidad</span>.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center mt-10 md:mt-0">
          <div className="relative w-80 h-56 md:w-105 md:h-75 rounded-xl overflow-hidden shadow-xl">
            <Image
              src="/chefRegister.jpg"
              alt="Chef Register"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
