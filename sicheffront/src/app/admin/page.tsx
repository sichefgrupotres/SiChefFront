"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.services";
import MetricCard from "@/components/admin/MetricCard";
import QuickAccessCard from "@/components/admin/QuickAccessCard";
import RevenueChart from "@/components/admin/RevenueChart";
import ActivityItem from "@/components/admin/ActivityItem";
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

  // ================= MÉTRICAS CALCULADAS =================
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
          <MetricCard
            title="Usuarios"
            value={totalUsers.toString()}
            variation={`Bloqueados: ${blockedUsers}`}
            icon="group"
          />
          <MetricCard
            title="Creadores"
            value={creators.toString()}
            variation=""
            icon="menu_book"
          />
          <MetricCard
            title="Suscriptores"
            value={subscribers.toString()}
            variation=""
            icon="payments"
          />
          <MetricCard
            title="Reportes"
            value="5" // Hardcode por ahora
            icon="report"
            alert
          />
        </div>
      </section>

      {/* GRÁFICA */}
      <section>
        <RevenueChart />
      </section>

      {/* ACCESOS DIRECTOS */}
      <section>
        <h2 className="text-2xl font-bold text-white border-l-4 border-orange-500 pl-3 mb-6">
          Accesos Directos
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickAccessCard
            icon="group"
            label="Usuarios"
            onClick={() => router.push("/admin/users")}
          />
          <QuickAccessCard
            icon="menu_book"
            label="Contenido"
            onClick={() => router.push("/admin/content")}
          />
          <QuickAccessCard
            icon="rate_review"
            label="Reseñas"
            onClick={() => router.push("/admin/reports")}
          />
          <QuickAccessCard
            icon="payments"
            label="Pagos"
            onClick={() => router.push("/admin/payments")}
          />
        </div>
      </section>

      {/* ACTIVIDAD RECIENTE */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white border-l-4 border-orange-500 pl-3">
            Actividad Reciente
          </h2>
          <button
            className="text-sm text-orange-400 hover:underline"
            onClick={() => router.push("/admin/activity")}
          >
            Ver todo
          </button>
        </div>

        <div className="space-y-3">
          <ActivityItem
            title="Nueva receta: Pasta Carbonara"
            subtitle="Chef Marco • Hace 5m"
            status="PENDIENTE"
          />
          <ActivityItem
            title="Nuevo suscriptor Premium"
            subtitle="Plan Anual"
            status="COMPLETADO"
          />
          <ActivityItem
            title="Reseña reportada"
            subtitle="Tacos al Pastor"
            status="URGENTE"
          />
        </div>
      </section>
    </div>
  );
}
