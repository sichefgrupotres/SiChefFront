export const uploadAvatar = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "TU_UPLOAD_PRESET");


   const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No hay token de autenticación");
    }

   const res = await fetch("http://localhost:3001/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Error subiendo imagen");

  const data = await res.json();
  return data.secure_url;
};
