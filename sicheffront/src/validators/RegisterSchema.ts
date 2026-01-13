import * as Yup from "yup";

export type Role = "CREATOR" | "USER";
export type Genero = "masculino" | "femenino" | "no_binario" | "no_responder";
export type RoleForm = Role | "";
export type GeneroForm = Genero | "";
// Definimos la interfaz de los valores del formulario, en este caso es REGISTER
export interface RegisterFormValuesInterface {
  name: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  roleId?: RoleForm;
}

// definimos los valores iniciales de mi formulario de Register
export const initialValuesRegister: RegisterFormValuesInterface = {
  name: "",
  lastname: "",
  email: "",
  password: "",
  confirmPassword: "",
  roleId: "",
};

// esquema de validaciones para este formulariuo con YUP
export const RegisterSchema = Yup.object({
  name: Yup.string()
    .required("El nombre es un campo obligatorio")
    .trim("No puede comenzar ni terminar con espacios")
    .min(3, "Debe contener al menos 3 caracteres")
    .max(100, "Debe contener como máximo 100 caracteres"),

  lastname: Yup.string()
    .required("El apellido es un campo obligatorio")
    .trim("No puede comenzar ni terminar con espacios")
    .min(3, "Debe contener al menos 3 caracteres")
    .max(100, "Debe contener como máximo 100 caracteres"),

  email: Yup.string()
    .email("email invalido")
    .required("el email es un campo obligatorio")
    .matches(
      /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      "Debe tener un email válido (por ejemplo: usuario@correo.com)"
    ),

  password: Yup.string()
    .required("La contraseña es un campo obligatorio")
    .min(8, "Debe contener al menos 8 caracteres")
    .max(15, "Debe contener como máximo 15 caracteres")
    .matches(/[A-Z]/, "Debe contener al menos una letra MAYUSCULA")
    .matches(/[a-z]/, "Debe contener al menos una letra minúscula")
    .matches(/[0-9]/, "Debe contener al menos un número")
    .matches(
      /[@$!%*?&]/,
      "Debe contener al menos un carácter especial (@, $, !, %, *, ?, &)"
    ),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
    .required("Es necesario confirmar la contraseña"),

  // cumpleaños: Yup.string().required("Fecha de nacimiento requerida"),

  // genero: Yup.string()
  //   .oneOf(
  //     ["masculino", "femenino", "no_binario", "no_responder"],
  //     "Seleccioná un género válido"
  //   )
  //   .required("Género requerido"),

  // nacionalidad: Yup.string().required("Nacionalidad requerida"),
  // ciudad: Yup.string().required("Ciudad requerida"),
  // paisDeResidencia: Yup.string().required("País de residencia requerido"),

  roleId: Yup.string()
    .oneOf(["USER", "CREATOR"], "Seleccioná un rol válido")
    .required("Rol requerido"),
});
