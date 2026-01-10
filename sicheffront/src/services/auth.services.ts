import { LoginFormValuesInterface } from "@/validators/LoginSchema";
import { RegisterFormValuesInterface } from "@/validators/RegisterSchema";
import { signIn } from "next-auth/react";
import Swal from "sweetalert2";

export const loginUserService = async (data: LoginFormValuesInterface) => {
  try {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.ok) {
      Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: "Bienvenido 👋",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      return true;
    }

    Swal.fire({
      icon: "error",
      title: "Error en el login",
      text: "Credenciales inválidas ❌",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });

    return false;
  } catch (error) {
    console.error("Error en login:", error);
    throw error;
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

    const data = await response.json();

    if (response.status === 409) {
      Swal.fire({
        icon: "warning",
        title: "Usuario ya registrado",
        text: "Este correo ya está en uso. Intenta iniciar sesión.",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
      return null;
    }

    if (!response.ok) {
      Swal.fire({
        icon: "error",
        title: "Error en el registro",
        text: data?.message || "No se pudo completar el registro",
      });
      return null;
    }

    Swal.fire({
      icon: "success",
      title: "Registro exitoso",
      text: "Tu cuenta fue creada correctamente 🎉",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });

    return data;
  } catch (error) {
    console.error("Registro no realizado", error);

    Swal.fire({
      icon: "error",
      title: "Error de conexión",
      text: "No se pudo conectar con el servidor",
    });

    return null;
  }
};

export const createPost = async (data, token: string) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => formData.append(key, v));
    } else {
      formData.append(key, value as any);
    }
  });

  const res = await fetch("http://localhost:3001/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return res.ok;
};
