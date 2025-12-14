"use client";
import { RegisterFormData } from "@/context/AuthContext";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";

const initialValues: RegisterFormData = {
  nombre: "",
  apellido: "",
  email: "",
  password: "",
  confirmPassword: "",
  cumpleaños: "",
  genero: "no_responder",
  nacionalidad: "",
  ciudad: "",
  paisDeResidencia: "",
  avatarUrl: "",
  role: "USER",
};

const RegisterForm = () => {
  const router = useRouter();

  const formik = useFormik<RegisterFormData>({
    initialValues,
    onSubmit: async (values) => {
      try {
        console.log("usuario registrado", values);
        router.push("/login");
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center bg-[#3D2B1F] p-4">
      <div className="w-full max-w-md space-y-8 py-10">

        {/* Header */}
        <div className="text-center">
           <span className="material-symbols-outlined text-[#F57C00] text-5xl!">Si Chef! skillet</span>
          <h1 className="text-white text-[32px] font-bold pt-4">
            Sumate a nuestra comunidad
          </h1>
          <p className="text-white text-base pt-1">
            Completa los datos para registrarte
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">

          {/* Nombre */}
          <Input label="Nombre" name="nombre" placeholder="Introduce tu nombre" icon="person" formik={formik} />

          {/* Apellido */}
          <Input label="Apellido" name="apellido" placeholder="Introduce tu apellido" icon="person" formik={formik} />

          {/* Email */}
          <Input label="Email" name="email" placeholder="Introduce tu email" type="email" icon="mail" formik={formik} />

          {/* Password */}
          <Input label="Contraseña" name="password" placeholder="Introduce una contraseña" type="password" icon="lock" formik={formik} />

          {/* Confirm Password */}
          <Input label="Confirmar contraseña" name="confirmPassword" placeholder="Repite la contraseña" type="password" icon="lock" formik={formik} />

          {/* Cumpleaños */}
          <Input label="Cumpleaños" name="cumpleaños" placeholder="Introduce tu Fecha de Nacimiento" type="date" icon="cake" formik={formik} />

          {/* Género */}
          <label className="flex flex-col">
            <p className="text-white pb-2">Género</p>
            <select
              name="genero"
              value={formik.values.genero}
              onChange={formik.handleChange}
              className="h-14 rounded-lg bg-[#543C2A] text-white px-4 focus:outline-none"
            >
              <option value="">Seleccionar</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="no_binario">No Binario</option>
              <option value="no_responder">Elijo no responder</option>
            </select>
          </label>

          {/* Nacionalidad */}
          <Input label="Nacionalidad" name="nacionalidad" placeholder="Introduce tu pais de nacimiento" icon="flag" formik={formik} />

          {/* Ciudad */}
          <Input label="Ciudad" name="ciudad" placeholder="Introduce tu ciudad de residencia" icon="location_city" formik={formik} />

          {/* País de residencia */}
          <Input label="País de residencia" name="paisDeResidencia" placeholder="Introduce tu pais de residencia" icon="public" formik={formik} />

          {/* Avatar */}
          <Input label="Avatar URL" name="avatarUrl" placeholder="Introduce el enlace de tu foto" icon="image" formik={formik} />

          {/* Role */}
          <label className="flex flex-col">
            <p className="text-white pb-2">Rol</p>
            <select
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              className="h-14 rounded-lg bg-[#543C2A] text-white px-4 focus:outline-none"
            >
              <option value="USER">Usuario</option>
              <option value="CREADOR">Creador</option>
            </select>
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-14 rounded-lg bg-[#F57C00] text-white text-lg font-bold transition-transform hover:scale-105"
          >
            Registrarse
          </button>
        </form>

       {/* Divider Google */}
      <div className="relative flex items-center py-4">
        <div className="flex-grow border-t border-gray-600"></div>
        <span className="flex-shrink mx-4 text-[#D2B48C] text-sm">
          O continuar con
        </span>
        <div className="grow border-t border-gray-600"></div>
      </div>

      {/* Google */}
      <div className="flex items-center justify-center">
        <button
          type="button"
          className="flex items-center justify-center w-14 h-14 bg-[#543C2A] rounded-full hover:scale-110"
        >
          {/* SVG */}
        </button>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 pt-6">
        <p>
          Al continuar, aceptas nuestros{" "}
          <a className="underline">Términos</a> y{" "}
          <a className="underline">Privacidad</a>.
        </p>
      </div>

    </div>
  </div>
);
}
export default RegisterForm;

/* ---------- Reusable Input ---------- */
const Input = ({
  label,
  name,
  placeholder,
  icon,
  type = "text",
  formik,
}: any) => (
  <label className="flex flex-col">
    <p className="text-white pb-2">{label}</p>
    <div className="bg-[#543C2A] flex items-center rounded-lg">
      <span className="material-symbols-outlined pl-4 text-[#D2B48C]">
        {icon}
      </span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={formik.values[name]}
        onChange={formik.handleChange}
        className="w-full h-14 bg-transparent text-white px-4 focus:outline-none"
      />
    </div>
  </label>
)
