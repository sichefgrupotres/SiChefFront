"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { adminService } from "@/services/admin.services";

interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  blocked: boolean;
  status: string;
}

export default function AdminUserPage() {
  const { id } = useParams(); // de Next.js App Router
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Convierte a string seguro
  const userId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    const fetchUser = async () => {
      if (!session?.backendToken || !userId) return;
      setLoading(true);
      try {
        const data = await adminService.getUserById(userId, session.backendToken);
        setUser(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, session]);

  if (loading) return <p className="text-white">Cargando usuario...</p>;
  if (!user) return <p className="text-red-400">Usuario no encontrado</p>;

  return (
    <div className="p-8 bg-[#181411] min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Rol: {user.roleId}</p>
      <p>Estado: {user.blocked ? "BLOQUEADO" : "ACTIVO"}</p>
    </div>
  );
}
