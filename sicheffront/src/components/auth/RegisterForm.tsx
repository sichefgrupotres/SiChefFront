"use client";
import {
  initialValuesRegister,
  RegisterFormValuesInterface,
  RegisterSchema,
} from "@/validators/RegisterSchema";
import { registerUserService } from "@/services/aut.services";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PATHROUTES } from "@/utils/PathRoutes";
import Image from "next/image";

const RegisterForm = () => {
  const router = useRouter();
  const formik = useFormik<RegisterFormValuesInterface>({
    initialValues: initialValuesRegister,
    validationSchema: RegisterSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await registerUserService(values);
        console.log("formulario enviado", response);
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
              className="space-y-4 text-black"
            >
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
                      value={formik.values.nombre}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="bg-[#543C2A] text-white h-12 rounded-lg pl-12 pr-4 w-full"
                    />
                  </div>

                  {formik.touched.nombre && formik.errors.nombre && (
                    <p className="text-red-400 text-sm">
                      {formik.errors.nombre}
                    </p>
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
                      name="apellido"
                      placeholder="Tu apellido"
                      value={formik.values.apellido}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="bg-[#543C2A] text-white h-12 rounded-lg pl-12 pr-4 w-full"
                    />
                  </div>

                  {formik.touched.apellido && formik.errors.apellido && (
                    <p className="text-red-400 text-sm">
                      {formik.errors.apellido}
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
                  <p className="text-red-400">{formik.errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password */}
                <div className="flex flex-col">
                  <label className="text-white">Contraseña</label>

                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#D2B48C]">
                      lock
                    </span>

                    <input
                      type="password"
                      name="password"
                      placeholder="Introduce tu contraseña"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="bg-[#543C2A] text-white h-12 rounded-lg px-4 pl-12 w-full"
                    />
                  </div>

                  {formik.touched.password && formik.errors.password && (
                    <p className="text-red-400">{formik.errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col">
                  <label className="text-white">Confirmar contraseña</label>

                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#D2B48C]">
                      lock_reset
                    </span>

                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirma tu contraseña"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="bg-[#543C2A] text-white h-12 rounded-lg px-4 pl-12 w-full"
                    />
                  </div>

                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <p className="text-red-400">
                        {formik.errors.confirmPassword}
                      </p>
                    )}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className={`w-full h-14 rounded-lg text-white font-bold transition-all cursor-pointer
            ${formik.isSubmitting
                    ? "bg-[#F57C00]/50 cursor-not-allowed"
                    : "bg-[#F57C00] hover:scale-105"
                  }
          `}
              >
                {formik.isSubmitting ? "Registrando..." : "Registrarse"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center pt-1">
              <div className="grow border-t border-gray-600"></div>
              <span className="mx-4 text-[#D2B48C] text-sm">
                ¿Ya tienes cuenta?
              </span>
              <Link
                href={PATHROUTES.LOGIN}
                className="mx-2 text-sm text-[#FFF3E0] underline"
              >Inicia Sesión
              </Link>

              <div className="grow border-t border-gray-600"></div>
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
