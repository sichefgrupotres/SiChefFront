"use client";
import { useFormik } from "formik";
import {
  initialValuesLogin,
  LoginFormValuesInterface,
  LoginSchema,
} from "@/validators/LoginSchema";
import { loginUserService } from "@/services/aut.services";
import { useRouter } from "next/navigation";
import Image from "next/image";

const LoginForm = () => {
  const router = useRouter();

  // const { setDataUser } = useAuth();

  const formik = useFormik<LoginFormValuesInterface>({
    initialValues: initialValuesLogin,
    validationSchema: LoginSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await loginUserService(values);
        console.log("Sesion iniciada con exito", response);
        router.push("/creator");
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
                Bienvenido
              </h1>
              <p className="text-white text-base pt-1">
                Inicia sesión para continuar
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={formik.handleSubmit} className="w-full space-y-4">
              {/* EMAIL */}
              <label className="flex flex-col w-full">
                <p className="text-white text-base font-medium pb-2">Email</p>
                <div className="bg-[#543C2A] flex items-center rounded-lg">
                  <div className="flex items-center justify-center pl-4 text-[#D2B48C]">
                    <span className="material-symbols-outlined">mail</span>
                  </div>

                  <input
                    type="email"
                    name="email"
                    placeholder="Introduce tu email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    className="w-full h-14 bg-transparent text-white placeholder:text-gray-300 px-4 focus:outline-none"
                  />
                </div>

                {formik.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.email}
                  </p>
                )}
              </label>

              {/* PASSWORD */}
              <label className="flex flex-col w-full">
                <p className="text-white text-base font-medium pb-2">
                  Contraseña
                </p>

                <div className="bg-[#543C2A] flex items-center rounded-lg">
                  <div className="flex items-center justify-center pl-4 text-[#D2B48C]">
                    <span className="material-symbols-outlined">lock</span>
                  </div>

                  <input
                    type="password"
                    name="password"
                    placeholder="Introduce tu contraseña"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    className="w-full h-14 bg-transparent text-white placeholder:text-gray-300 px-4 focus:outline-none"
                  />
                </div>

                {formik.errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.password}
                  </p>
                )}
              </label>

              {/* Forgot password */}
              <div className="flex justify-end">
                <p className="text-[#D2B48C] text-sm underline cursor-pointer">
                  Olvidé mi contraseña
                </p>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className={`w-full h-14 rounded-lg text-lg font-bold text-white transition-transform duration-200 cursor-pointer
                                ${formik.isSubmitting
                    ? "bg-orange-300 cursor-not-allowed"
                    : "bg-[#F57C00] hover:scale-105"
                  }`}
              >
                {formik.isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center py-4">
              <div className="grow border-t border-gray-600"></div>
              <span className="mx-4 text-[#D2B48C] text-sm">
                ¿No tienes cuenta aun?
              </span>
              <div className="grow border-t border-gray-600"></div>
            </div>

            <button
              type="button"
              className="w-full h-14 rounded-lg bg-[#FFF3E0] text-[#F57C00] text-lg font-bold border border-[#F57C00]/50 transition-transform duration-200 hover:scale-105 hover:bg-[#FFE0B2]"
              onClick={() => router.push("/register")}>
              Registrate
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
              >
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
            {/* Footer */}
            <div className=" items'center text-center text-xs text-gray-400 pt-2">
              <p>
                Al continuar, aceptas nuestros{" "}
                <span className="underline cursor-pointer">Términos</span> y{" "}
                <span className="underline cursor-pointer">Privacidad</span>.
              </p>
            </div>
          </div>
        </div>


        <div className="hidden md:block md:w-1/2 h-screen relative">
          <Image
            src="/chefformLogin.jpg"
            alt="Chef Login"
            fill
            priority
            className="object-contain"
          />
        </div>

      </div>
    </div>
  );
};

export default LoginForm;
