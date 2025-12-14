"use client";

import { useFormik } from "formik";
import { RegisterSchema } from "@/validators/RegisterSchema";
import { useAuth } from "@/context/AuthContext";
import { RegisterFormData } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { uploadAvatar } from "@/services/uploadAvatar";

export default function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();

  const formik = useFormik<RegisterFormData>({
    initialValues: {
      nombre: "",
      apellido: "",
      cumpleaños: "",
      genero: "no_responder",
      nacionalidad: "",
      ciudad: "",
      paisDeResidencia: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatarUrl: "",
      role: "USER",
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      await register(values);
      router.push("/");
    },
  });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    const url = await uploadAvatar(file);
    formik.setFieldValue("avatarUrl", url);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-start overflow-x-hidden p-4 bg-[#3D2B1F]">
      <div className="w-full max-w-md space-y-8 py-10">
        {/* Header */}
        <div className="text-center">
          <span className="material-symbols-outlined text-[#F57C00] `!text-5xl`">
            skillet
          </span>
          <h1 className="text-white text-[32px] font-bold leading-tight pt-4">
            Bienvenido a Si Chef!
          </h1>
          <p className="text-white text-base pt-1">Registrate</p>
        </div>
      </div>
      {/* FORM */}
      <form onSubmit={formik.handleSubmit} className="w-full space-y-4">
        {/* Nombre */}
        <label className="flex flex-col w-full">
          <p className="text-white text-base font-medium pb-2">Nombre</p>

          <div className="bg-[#543C2A] flex items-center rounded-lg">
            <div className="flex items-center justify-center pl-4 text-[#D2B48C]">
              <span className="material-symbols-outlined">lock</span>
            </div>

            <input
              type="text"
              name="nombre"
              placeholder="Introduce tu nombre"
              value={formik.values.nombre}
              onChange={formik.handleChange}
              className="w-full h-14 bg-transparent text-white placeholder:text-gray-300 px-4 focus:outline-none"
            />
          </div>

          {formik.errors.nombre && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.nombre}</p>
          )}
        </label>

        {/*Apellido*/}
        <label className="flex flex-col w-full">
          <p className="text-white text-base font-medium pb-2">Apellido</p>

          <div className="bg-[#543C2A] flex items-center rounded-lg">
            <div className="flex items-center justify-center pl-4 text-[#D2B48C]">
              <span className="material-symbols-outlined">lock</span>
            </div>

            <input
              type="text"
              name="apellido"
              placeholder="Introduce tu apellido"
              value={formik.values.apellido}
              onChange={formik.handleChange}
              className="w-full h-14 bg-transparent text-white placeholder:text-gray-300 px-4 focus:outline-none"
            />
          </div>

          {formik.errors.apellido && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.apellido}
            </p>
          )}
        </label>

        {/*Fecha de nacimiento*/}
        <label className="flex flex-col w-full">
          <p className="text-white text-base font-medium pb-2">
            Fecha de Nacimiento
          </p>

          <div className="bg-[#543C2A] flex items-center rounded-lg">
            <div className="flex items-center justify-center pl-4 text-[#D2B48C]">
              <span className="material-symbols-outlined">lock</span>
            </div>

            <input
              type="date"
              name="cumpleaños"
              placeholder="Introduce tu fecha de nacimiento"
              value={formik.values.cumpleaños}
              onChange={formik.handleChange}
              className="w-full h-14 bg-transparent text-white placeholder:text-gray-300 px-4 focus:outline-none"
            />
          </div>

          {formik.errors.cumpleaños && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.cumpleaños}
            </p>
          )}
        </label>

        {/* Nacionalidad */}
        <label className="flex flex-col w-full">
          <p className="text-white text-base font-medium pb-2">Nacionalidad</p>

          <div className="bg-[#543C2A] flex items-center rounded-lg">
            <div className="flex items-center justify-center pl-4 text-[#D2B48C]">
              <span className="material-symbols-outlined">mail</span>
            </div>

            <input
              type="text"
              name="nacionalidad"
              placeholder="Introduce tu nacionalidad"
              value={formik.values.nacionalidad}
              onChange={formik.handleChange}
              className="w-full h-14 bg-transparent text-white placeholder:text-gray-300 px-4 focus:outline-none"
            />
          </div>

          {formik.errors.nacionalidad && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.nacionalidad}
            </p>
          )}
        </label>

        {/* Ciudad */}
        <label className="flex flex-col w-full">
          <p className="text-white text-base font-medium pb-2">Ciudad</p>

          <div className="bg-[#543C2A] flex items-center rounded-lg">
            <div className="flex items-center justify-center pl-4 text-[#D2B48C]">
              <span className="material-symbols-outlined">mail</span>
            </div>

            <input
              type="text"
              name="ciudad"
              placeholder="Introduce tu ciudad de residencia"
              value={formik.values.ciudad}
              onChange={formik.handleChange}
              className="w-full h-14 bg-transparent text-white placeholder:text-gray-300 px-4 focus:outline-none"
            />
          </div>

          {formik.errors.ciudad && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.ciudad}</p>
          )}
        </label>

        {/* Pais de Residencia */}
        <label className="flex flex-col w-full">
          <p className="text-white text-base font-medium pb-2">
            Pais de Residencia
          </p>

          <div className="bg-[#543C2A] flex items-center rounded-lg">
            <div className="flex items-center justify-center pl-4 text-[#D2B48C]">
              <span className="material-symbols-outlined">mail</span>
            </div>

            <input
              type="text"
              name="paisDeResidencia"
              placeholder="Introduce tu pais de residencia"
              value={formik.values.paisDeResidencia}
              onChange={formik.handleChange}
              className="w-full h-14 bg-transparent text-white placeholder:text-gray-300 px-4 focus:outline-none"
            />
          </div>

          {formik.errors.paisDeResidencia && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.paisDeResidencia}
            </p>
          )}
        </label>

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
            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
          )}
        </label>

        {/* PASSWORD */}
        <label className="flex flex-col w-full">
          <p className="text-white text-base font-medium pb-2">Contraseña</p>

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

        {/* Confirm PASSWORD */}
        <label className="flex flex-col w-full">
          <p className="text-white text-base font-medium pb-2">
            Confirmar contraseña
          </p>

          <div className="bg-[#543C2A] flex items-center rounded-lg">
            <div className="flex items-center justify-center pl-4 text-[#D2B48C]">
              <span className="material-symbols-outlined">lock</span>
            </div>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirma la contraseña"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              className="w-full h-14 bg-transparent text-white placeholder:text-gray-300 px-4 focus:outline-none"
            />
          </div>

          {formik.errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.confirmPassword}
            </p>
          )}
        </label>

        {/* Avatr Url */}
        <label className="flex flex-col w-full">
          <p className="text-white text-base font-medium pb-2">
            Carga tu foto de Perfil
          </p>

          <div className="bg-[#543C2A] flex items-center rounded-lg">
            <div className="flex items-center justify-center pl-4 text-[#D2B48C]">
              <span className="material-symbols-outlined">mail</span>
            </div>

            <input
              type="url"
              name="avatarUrl"
              placeholder="Introduce el enlace de tu foto de perfil"
              value={formik.values.avatarUrl}
              onChange={formik.handleChange}
              className="w-full h-14 bg-transparent text-white placeholder:text-gray-300 px-4 focus:outline-none"
            />
          </div>

          {formik.errors.avatarUrl && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.avatarUrl}
            </p>
          )}
        </label>

        {/* Rol */}
        <label className="flex flex-col w-full">
          <p className="text-white text-base font-medium pb-2">Rol</p>

          <div className="bg-[#543C2A] flex items-center rounded-lg">
            <div className="flex items-center justify-center pl-4 text-[#D2B48C]">
              <span className="material-symbols-outlined">person</span>
            </div>

            <input
              type="text"
              name="role"
              placeholder="Define tu Role"
              value={formik.values.role}
              onChange={formik.handleChange}
              className="w-full h-14 bg-transparent text-white placeholder:text-gray-300 px-4 focus:outline-none"
            />
          </div>

          {formik.errors.role && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.role}</p>
          )}
        </label>

        <button
          type="submit"
          className="mt-2 rounded-lg bg-primary py-3 text-white font-bold"
        >
          Registrarse
        </button>

        {/* SUBMIT */}
       <button
                        type="submit"
                        disabled={formik.isSubmitting}
                        className={`w-full h-14 rounded-lg text-lg font-bold text-white transition-transform duration-200
                                ${formik.isSubmitting ? "bg-orange-300 cursor-not-allowed" : "bg-[#F57C00] hover:scale-105"}`}
                    >
                        {formik.isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative flex items-center py-4">
                    <div className="flex-grow border-t border-gray-600"></div>
                    <span className="mx-4 text-[#D2B48C] text-sm">
                        ¿Eres nuevo? Regístrate
                    </span>
                    <div className="flex-grow border-t border-gray-600"></div>
                </div>

                <button
                    type="button"
                    className="w-full h-14 rounded-lg bg-[#FFF3E0] text-[#F57C00] text-lg font-bold border border-[#F57C00]/50 transition-transform duration-200 hover:scale-105 hover:bg-[#FFE0B2]"
                    onClick={() => router.push("/register")}>
                    Registrarse
                </button>
            </div>
  )}
