import { LoginFormValuesInterface } from "@/validators/LoginSchema"

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