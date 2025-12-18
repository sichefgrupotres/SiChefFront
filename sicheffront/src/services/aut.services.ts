import { LoginFormValuesInterface } from "@/validators/LoginSchema";
import { RecipeFormValuesInterface } from "@/validators/RecipeSchema";
import { RegisterFormValuesInterface } from "@/validators/RegisterSchema";

export const loginUserService = async (Data: LoginFormValuesInterface) => {
  try {
    const response = await fetch(`http://localhost:3001/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Data),
    });
    console.log(Data);

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
    const response = await fetch(`http://localhost:3001/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    console.log(response);

    if (response.ok) {
      alert("Registro exitoso ✔️");
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error("Registro no realizado", error);
    throw error;
  }
};

export const recipeFormValue = async (
  recipeData: RecipeFormValuesInterface
) => {
  const response = await fetch("http://localhost:3001/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipeData),
  });

  if (!response.ok) {
    throw await response.json();
  }
  alert("Creacion de receta exitosa ✔️");
  return response.json();
};
