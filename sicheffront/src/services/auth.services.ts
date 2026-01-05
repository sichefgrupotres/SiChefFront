import { CreateRecipePayload } from "@/interfaces/IRecipe";
import { LoginFormValuesInterface } from "@/validators/LoginSchema";
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
      Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: "Bienvenido 👋",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      const result = await response.json();

      // // 🔐 GUARDAR TOKEN PARA USARLO EN /posts
      // if (result.token) {
      //   localStorage.setItem("token", result.token);
      // }

      return result;
    } else {
      
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

export const createPost = async (
  data: CreateRecipePayload,
  session: any
): Promise<boolean> => {
  // Intenta leer distintos nombres de token que pueda usar el backend
  if (!session.backendToken) {
    throw new Error("No hay sesión activa. Por favor, inicia sesión.");
  }

  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("ingredients", data.ingredients);
    formData.append("difficulty", data.difficulty);
    formData.append("isPremium", String(data.isPremium));
    formData.append("Categories", String(data.categories));

     if (data.file) {
      formData.append("file", data.file);
    }

    const response = await fetch("http://localhost:3001/posts", {
      method: "POST",
      headers: {
      },
      body: formData,
    });

    if (response.status === 401) {
      console.error("Token inválido o expirado");
      return false;
    }

    return response.ok;
  } catch (error) {
    console.error("Error al crear el post:", error);
    return false;
  }
};

 


