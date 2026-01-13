export class AdminService {
  private baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin`; // Ajusta si tu backend tiene otra URL

  async getAllUsers(token: string) {
    const res = await fetch(`${this.baseUrl}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("No se pudieron obtener los usuarios");
    return res.json();
  }

  async getUserById(id: string, token: string) {
    const res = await fetch(`${this.baseUrl}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Usuario no encontrado");
    return res.json();
  }

  async updateUserRole(userId: string, role: string, token: string) {
    const res = await fetch(`${this.baseUrl}/users/${userId}/role`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    });
    if (!res.ok) throw new Error("Error al cambiar rol");
    return res.json();
  }

  async blockUser(userId: string, blocked: boolean, token: string) {
    const res = await fetch(`${this.baseUrl}/users/${userId}/block`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ blocked }),
    });
    if (!res.ok) throw new Error("Error al bloquear/desbloquear usuario");
    return res.json();
  }

  //   async getAllTutorials(token: string) {
  //   const res = await fetch(`${this.baseUrl}/tutorials`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  //   if (!res.ok) throw new Error("No se pudieron obtener los tutoriales");
  //   return res.json();
  // }
}

export const adminService = new AdminService();
