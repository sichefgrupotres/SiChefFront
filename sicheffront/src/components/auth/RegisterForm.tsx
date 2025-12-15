"use client";
import { initialValuesRegister, RegisterFormValuesInterface, RegisterSchema } from "@/validators/RegisterSchema";
import { registerUserService } from "@/services/aut.services";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const router = useRouter()
  const formik = useFormik<RegisterFormValuesInterface>({
    initialValues: initialValuesRegister,
    validationSchema: RegisterSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await registerUserService(values);
        console.log("formulario enviado", response)
        router.push("/login");
        resetForm();

      } catch (error) {
        console.error(error);
      }
    }

  })
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center bg-[#3D2B1F] p-4">
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
        <form onSubmit={formik.handleSubmit} className="space-y-4 text-black">

          {/* Nombre */}
          <div className="flex flex-col">
            <label className="text-white">Nombre</label>

            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#D2B48C]">
                badge
              </span>

              <input
                type="text"
                name="nombre"
                placeholder="Tu nombre"
                value={formik.values.nombre}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-[#543C2A] text-white h-12 rounded-lg pl-12 pr-4 w-full"
              />
            </div>

            {formik.touched.nombre && formik.errors.nombre && (
              <p className="text-red-400">{formik.errors.nombre}</p>
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
              <p className="text-red-400">{formik.errors.apellido}</p>
            )}
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

            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-red-400">{formik.errors.confirmPassword}</p>
            )}
          </div>


          {/* Cumpleaños */}
          <div className="flex flex-col">
            <label className="text-white">Fecha de nacimiento</label>

            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#D2B48C]">
                calendar_today
              </span>

              <input
                type="date"
                name="cumpleaños"
                value={formik.values.cumpleaños}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-[#543C2A] text-white h-12 rounded-lg pl-12 pr-4 w-full"
              />
            </div>

            {formik.touched.cumpleaños && formik.errors.cumpleaños && (
              <p className="text-red-400">{formik.errors.cumpleaños}</p>
            )}
          </div>


          {/* Género */}
          <div className="flex flex-col">
            <label className="text-white">Género</label>

            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#D2B48C]">
                wc
              </span>

              <select
                name="genero"
                value={formik.values.genero}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-[#543C2A] text-white h-12 rounded-lg pl-12 pr-4 w-full"
              >
                <option value="" disabled>
                  Seleccioná una opción
                </option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="no_binario">No binario</option>
                <option value="no_responder">Prefiero no responder</option>
              </select>
            </div>

            {formik.touched.genero && formik.errors.genero && (
              <p className="text-red-400">{formik.errors.genero}</p>
            )}
          </div>


          {/* Nacionalidad */}
          <div className="flex flex-col">
            <label className="text-white">Nacionalidad</label>

            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#D2B48C]">
                public
              </span>

              <input
                type="text"
                name="nacionalidad"
                placeholder="Ej: Argentina"
                value={formik.values.nacionalidad}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-[#543C2A] text-white h-12 rounded-lg pl-12 pr-4 w-full"
              />
            </div>

            {formik.touched.nacionalidad && formik.errors.nacionalidad && (
              <p className="text-red-400">{formik.errors.nacionalidad}</p>
            )}
          </div>


          {/* Ciudad */}
          <div className="flex flex-col">
            <label className="text-white">Ciudad</label>

            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#D2B48C]">
                location_city
              </span>

              <input
                type="text"
                name="ciudad"
                placeholder="Ej: Buenos Aires"
                value={formik.values.ciudad}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-[#543C2A] text-white h-12 rounded-lg pl-12 pr-4 w-full"
              />
            </div>

            {formik.touched.ciudad && formik.errors.ciudad && (
              <p className="text-red-400">{formik.errors.ciudad}</p>
            )}
          </div>


          {/* País de residencia */}
          <div className="flex flex-col">
            <label className="text-white">País de residencia</label>

            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#D2B48C]">
                flag
              </span>

              <input
                type="text"
                name="paisDeResidencia"
                placeholder="Ej: Argentina"
                value={formik.values.paisDeResidencia}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-[#543C2A] text-white h-12 rounded-lg pl-12 pr-4 w-full"
              />
            </div>

            {formik.touched.paisDeResidencia && formik.errors.paisDeResidencia && (
              <p className="text-red-400">{formik.errors.paisDeResidencia}</p>
            )}
          </div>

          {/* Avatar */}
          <div className="flex flex-col">
            <label className="text-white">Avatar (URL)</label>

            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#D2B48C]">
                image
              </span>

              <input
                type="url"
                name="avatarUrl"
                placeholder="https://mi-avatar.com/foto.jpg"
                value={formik.values.avatarUrl}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-[#543C2A] text-white h-12 rounded-lg pl-12 pr-4 w-full"
              />
            </div>

            {formik.touched.avatarUrl && formik.errors.avatarUrl && (
              <p className="text-red-400">{formik.errors.avatarUrl}</p>
            )}
          </div>



          {/* Rol */}
          <div className="flex flex-col">
            <label className="text-white">Rol</label>
            <select
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="bg-[#543C2A] text-white h-12 rounded-lg px-4"
            >
              <option value="">Seleccionar</option>
              <option value="USER">Usuario</option>
              <option value="CREATOR">Creador</option>
            </select>
            {formik.touched.role && formik.errors.role && (
              <p className="text-red-400">{formik.errors.role}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className={`w-full h-14 rounded-lg text-white font-bold transition-all
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
        <div className="relative flex items-center py-4">
          <div className="grow border-t border-gray-600"></div>
          <span className="mx-4 text-[#D2B48C] text-sm">
            ¿Ya tienes cuenta?
          </span>
          <div className="grow border-t border-gray-600"></div>
        </div>

        {/* Login */}
        <button
          type="button"
          className="w-full h-14 rounded-lg bg-[#FFF3E0] text-[#F57C00] text-lg font-bold border border-[#F57C00]/50 transition-transform hover:scale-105"
          onClick={() => router.push("/login")}
        >
          Iniciar Sesión
        </button>

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
  )
};

export default RegisterForm;
