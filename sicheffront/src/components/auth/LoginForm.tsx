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
import Link from "next/link";
import { PATHROUTES } from "@/utils/PathRoutes";

const LoginForm = () => {
  const router = useRouter();

  // const { setDataUser } = useAuth();

  const formik = useFormik<LoginFormValuesInterface>({
    initialValues: initialValuesLogin,
    validationSchema: LoginSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await loginUserService(values);

        // Guardar usuario en contexto
        // setDataUser(response);

        console.log("sesion iniciada", response);

        // ✔ Si existe token => login exitoso
        if (response?.token) {
          router.push(PATHROUTES.HOME); // redirige al home
        }

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
          <div className="w-full max-w-md space-y-8">
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
            <div className="flex items-center py-4">
              <div className="grow border-t border-gray-600"></div>
              <div>
                <span className="mx-4 text-[#D2B48C] text-sm">
                  ¿Eres nuevo?
                </span>
                <Link
                  href={PATHROUTES.REGISTER}
                  className="mx-2 text-sm text-[#FFF3E0] underline"
                >
                  Regístrate
                </Link>
              </div>
              <div className="grow border-t border-gray-600"></div>
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


        <div className="w-full md:w-1/2 flex justify-center mt-10 md:mt-0">
          <div className="relative w-80 h-56 md:w-105 md:h-75 rounded-xl overflow-hidden shadow-xl">
            <Image
              src="/chefLogin.jpg"
              alt="Chef Login"
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

export default LoginForm;
