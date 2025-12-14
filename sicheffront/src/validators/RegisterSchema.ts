import * as Yup from "yup";

export const RegisterSchema = Yup.object({
  nombre: Yup.string().required("Nombre Requerido"),
  apellido: Yup.string().required("Apellido Requerido"),
  email: Yup.string().email("Email inválido").required("Email Requerido"),
  password: Yup.string().min(6).required("Contraseña Requerido"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("Contraseña")], "Las contraseñas no coinciden")
    .required("Campo Obligatorio"),
  cumpleaños: Yup.string().required("Fecha de Nacimiento Requerido"),
  genero: Yup.string().required("Genero Requerido"),
  nacionalidad: Yup.string().required("Nacionalidad Requerido"),
  ciudad: Yup.string().required("Ciudad Requerido"),
  paisDeResidencia: Yup.string().required("Residencia Requerido"),
  role: Yup.string().required("Campo Requerido"),
});