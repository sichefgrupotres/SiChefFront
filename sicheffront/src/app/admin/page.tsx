"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.services";
import MetricCard from "@/components/admin/MetricCard";
import QuickAccessCard from "@/components/admin/QuickAccessCard";
import ContentChart from "@/components/admin/ContentCreatorChart";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  blocked: boolean;
}

export default function AdminPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH USUARIOS =================
  const fetchUsers = async () => {
    if (!session?.backendToken) return;
    setLoading(true);
    try {
      const data = await adminService.getAllUsers(session.backendToken);
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [session]);

  // ================= MÉTRICAS =================
  const totalUsers = users.length;
  const blockedUsers = users.filter((u) => u.blocked).length;
  const creators = users.filter((u) => u.roleId === "CREATOR").length;
  const subscribers = users.filter((u) => u.roleId === "SUSCRIPTOR").length;

  return (
    <div className="flex flex-col gap-8 p-4 pb-28 bg-[#181411] min-h-screen px-4 sm:px-8 lg:px-16">
      {/* HEADER */}
      <section>
        <h1 className="text-2xl font-bold text-white border-l-4 border-orange-500 pl-3">
          Panel de Control
        </h1>
        <p className="text-sm text-white/60 mt-1 ml-4">
          Resumen general de la plataforma
        </p>
      </section>

      {/* MÉTRICAS */}
      <section>
        <p className="text-sm text-white/60 mb-4">MÉTRICAS CLAVE</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => router.push("/admin/users")}
            className="cursor-pointer hover:scale-[1.02] transition"
          >
            <MetricCard
              title="Usuarios"
              value={totalUsers.toString()}
              variation={`Bloqueados: ${blockedUsers}`}
              icon="group"
            />
          </div>

          <div
            onClick={() => router.push("/admin/users?role=CREATOR")}
            className="cursor-pointer hover:scale-[1.02] transition"
          >
            <MetricCard
              title="Creadores"
              value={creators.toString()}
              variation=""
              icon="menu_book"
            />
          </div>

          <div
            onClick={() => router.push("/admin/users?role=SUSCRIPTOR")}
            className="cursor-pointer hover:scale-[1.02] transition"
          >
            <MetricCard
              title="Suscriptores"
              value={subscribers.toString()}
              variation=""
              icon="payments"
            />
          </div>

          <div
            onClick={() => router.push("/admin/users?status=blocked")}
            className="cursor-pointer hover:scale-[1.02] transition"
          >
            <MetricCard
              title="Bloqueados"
              value={blockedUsers.toString()}
              variation=""
              icon="block"
            />
          </div>
        </div>
      </section>

      {/* GRÁFICA DE CONTENIDO */}
      <section>
        {session?.backendToken && (
          <ContentChart token={session.backendToken} />
        )}
      </section>

      {/* ACCESOS DIRECTOS */}
      <section>
        <h2 className="text-2xl font-bold text-white border-l-4 border-orange-500 pl-3 mb-6">
          Accesos Directos
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickAccessCard
            icon="menu_book"
            label="Contenido"
            onClick={() => router.push("/admin/content")}
          />
        </div>
      </section>
    </div>
  );
}
