import * as Yup from 'yup';

export type Role = "CREATOR" | "USER";
export type Genero = "masculino" | "femenino" | "no_binario" | "no_responder"
export type RoleForm = Role | "";
export type GeneroForm = Genero | "";
// Definimos la interfaz de los valores del formulario, en este caso es REGISTER
export interface RegisterFormValuesInterface {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  confirmPassword: string;
  cumpleaños: string;
  genero: GeneroForm;
  nacionalidad: string;
  ciudad: string;
  paisDeResidencia: string;
  avatarUrl: string;
  role: RoleForm;
}


// definimos los valores iniciales de mi formulario de Register
export const initialValuesRegister: RegisterFormValuesInterface = {
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  confirmPassword: '',
  cumpleaños: '',
  genero: '',
  nacionalidad: '',
  ciudad: '',
  paisDeResidencia: '',
  avatarUrl: '',
  role: '',
};

// esquema de validaciones para este formulariuo con YUP
export const RegisterSchema = Yup.object({
  nombre: Yup.string().required("Nombre requerido"),
  apellido: Yup.string().required("Apellido requerido"),

  email: Yup.string()
    .email("Email inválido")
    .required("Email requerido"),

  password: Yup.string()
    .min(6, "Mínimo 6 caracteres")
    .required("Contraseña requerida"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
    .required("Confirmá la contraseña"),

  cumpleaños: Yup.string().required("Fecha de nacimiento requerida"),

  genero: Yup.string()
    .oneOf(
      ["masculino", "femenino", "no_binario", "no_responder"],
      "Seleccioná un género válido"
    )
    .required("Género requerido"),

  nacionalidad: Yup.string().required("Nacionalidad requerida"),
  ciudad: Yup.string().required("Ciudad requerida"),
  paisDeResidencia: Yup.string().required("País de residencia requerido"),

  role: Yup.string()
    .oneOf(["USER", "CREATOR"], "Seleccioná un rol válido")
    .required("Rol requerido"),
}); 