import { LoginFormValuesInterface } from "@/validators/LoginSchema";
import { RecipeFormValuesInterface } from "@/validators/RecipeSchema";
import { RegisterFormValuesInterface } from "@/validators/RegisterSchema";
import Swal from "sweetalert2";

export const loginUserService = async (Data: LoginFormValuesInterface) => {
  try {
    const response = await fetch("http://localhost:3001/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Data),
    });

    console.log(Data);

    if (response.ok) {
      // alert("Inicio de sesión exitoso ✔️");
      Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: "Bienvenido 👋",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      const result = await response.json();

      // 🔐 GUARDAR TOKEN PARA USARLO EN /posts
      if (result.token) {
        localStorage.setItem("token", result.token);
      }

      return result;
    } else {
      // alert("Error en el login del usuario ❌");

      Swal.fire({
        icon: "error",
        title: "Error en el login",
        text: "Credenciales inválidas ❌",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });

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
      // alert("Registro exitoso ✔️");
      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "Tu cuenta fue creada correctamente 🎉",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

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
  try {
    // obtener token guardado en login
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No hay token de autenticación");
    }

    const response = await fetch("http://localhost:3001/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 👈 CLAVE
      },
      body: JSON.stringify(recipeData),
    });

    if (!response.ok) {
      // opcional: leer mensaje del backend
      const errorText = await response.text();
      throw new Error(errorText || "Error al crear la receta");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Registro no realizado", error);
    throw error;
  }
};
