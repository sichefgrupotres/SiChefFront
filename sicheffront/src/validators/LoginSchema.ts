import * as Yup from 'yup';

// Definimos la interfaz de los valores del formulario, en este caso es lOGIN
export interface LoginFormValuesInterface {
    email: string;
    password: string;
}


// definimos los valores iniciales de mi formulario de login
export const initialValuesLogin: LoginFormValuesInterface = {
    email: '',
    password: ''
}

// esquema de validaciones para este formulariuo con YUP
export const LoginSchema = Yup.object({
    email: Yup.string().email('Email no valido').required('El email es obligatorio'),
    password: Yup.string().min(6, 'la contrasena debe tener por lo menos 6 caracteres').required('la contrasena es obligatoria')
}) 