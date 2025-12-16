import { LoginFormValuesInterface } from "@/validators/LoginSchema";
import { RecipeFormValuesInterface } from "@/validators/RecipeSchema";
import { RegisterFormValuesInterface } from "@/validators/RegisterSchema";

export const loginUserService = async (userData: LoginFormValuesInterface) => {
  try {
    const response = await fetch(`http://localhost:3001/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      alert("Inicio de sesión exitoso ✔️");
      return response.json();
    } else {
      alert("Error en el login del usuario ❌");
      throw new Error("Error en el logeo del usuario");
    }
  } catch (error: any) {
    throw new Error(error);
  }
};

export const registerUserService = async (
  userData: RegisterFormValuesInterface
) => {
  try {
    const response = await fetch(`http://localhost:3001/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    console.log(response);

    if (response.ok) {
      alert("Registro exitoso ✔️");
      const data = await response.json().catch(() => null);
      return data;
    }
  } catch (error) {
    console.error("Registro no realizado", error);
    throw error;
  }
};

export const recipeFormValue = async (recipeData: RecipeFormValuesInterface) => {
  try {
    const response = await fetch(`http://localhost:3001/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipeData),
    });

     if (response.ok) {
      alert("Creacion de receta exitoso ✔️");
      const data = await response.json().catch(() => null);
      return data;
    }
  } catch (error) {
    console.error("Error al crear receta", error);
    throw error;
  }
};

