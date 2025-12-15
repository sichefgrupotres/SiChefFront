import { LoginFormValuesInterface } from "@/validators/LoginSchema"
import { RegisterFormValuesInterface } from '@/validators/RegisterSchema';

export const loginUserService = async (userData: LoginFormValuesInterface) => {

    try {

        const response = await fetch(`http://localhost:3001/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })

        if (response.ok) {
            alert('Inicio de sesión exitoso ✔️')
            return response.json()


        } else {
            alert('Error en el login del usuario ❌');
            throw new Error('Error en el logeo del usuario');
        }


    } catch (error: any) {

        throw new Error(error);

    }
}

export const registerUserService = async (userData: RegisterFormValuesInterface) => {
    try {
        const response = await fetch(`http://localhost:3001/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })

        if (response.ok) {
            alert('Registro exitoso ✔️')
            return response.json()

        } else {
            alert('Error en el registro del usuario ❌');
            throw new Error('Error en el registro del usuario');
        }
    } catch (error: any) {

        throw new Error(error);
    }
}