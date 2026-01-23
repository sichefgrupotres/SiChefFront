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

interface Subscription {
  plan: string;
  status: string;
  period: {
    start: string;
    end: string;
  };
  cancelAtPeriodEnd: boolean;
  userId: string;
  userEmail: string;
}

export default function AdminPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubs, setLoadingSubs] = useState(true);
  const [recipesCount, setRecipesCount] = useState(0);

  // ================= FETCH USUARIOS (NO TOCAR) =================
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

  // ================= FETCH SUSCRIPCIONES (NUEVO, AISLADO) =================
  const fetchSubscriptions = async () => {
    if (!session?.backendToken) return;
    try {
      setLoadingSubs(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${session.backendToken}`,
          },
        },
      );
      if (!res.ok) throw new Error("Error al obtener suscripciones");
      const data = await res.json();
      setSubscriptions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSubs(false);
    }
  };

  const fetchRecipesCount = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
      if (!res.ok) return;

      const data = await res.json();

      setRecipesCount(
        typeof data.total === "number" ? data.total : (data.data?.length ?? 0),
      );
    } catch (err) {
      console.error("Error al obtener cantidad de recetas", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchSubscriptions();
    fetchRecipesCount();
  }, [session]);

  // ================= MÉTRICAS EXISTENTES (NO TOCAR) =================
  const totalUsers = users.length;
  const blockedUsers = users.filter((u) => u.blocked).length;
  const creators = users.filter((u) => u.roleId === "CREATOR").length;
  const subscribers = users.filter((u) => u.roleId === "SUSCRIPTOR").length;

  // ================= MÉTRICA PREMIUM REAL =================
  const activePremiumSubscribers = subscriptions.filter(
    (s) => s.status === "ACTIVE",
  ).length;

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
              variation={`Premium activos: ${activePremiumSubscribers}`}
              icon="payments"
            />
          </div>

          <div className="cursor-pointer hover:scale-[1.02] transition">
            <MetricCard
              title="Recetas"
              value={recipesCount.toString()}
              variation="Total en la aplicación"
              icon="restaurant_menu"
            />
          </div>
        </div>
      </section>

      {/* LISTADO DE SUSCRIPTORES PREMIUM (NUEVO) */}
      <section>
        <h2 className="text-2xl font-bold text-white border-l-4 border-orange-500 pl-3 mb-6">
          Suscriptores Premium
        </h2>

        {loadingSubs ? (
          <p className="text-white/60">Cargando suscriptores...</p>
        ) : subscriptions.length === 0 ? (
          <p className="text-white/60">No hay suscripciones registradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-white">
              <thead className="bg-[#2a221b] text-white/80">
                <tr>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Plan</th>
                  <th className="p-3 text-left">Estado</th>
                  <th className="p-3 text-left">Periodo</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr
                    key={sub.userId}
                    className="border-b border-white/10 hover:bg-white/5"
                  >
                    <td className="p-3">{sub.userEmail}</td>
                    <td className="p-3">{sub.plan}</td>
                    <td
                      className={`p-3 font-semibold ${
                        sub.status === "ACTIVE"
                          ? "text-green-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {sub.status}
                    </td>
                    <td className="p-3">
                      {new Date(sub.period.start).toLocaleDateString()} —{" "}
                      {new Date(sub.period.end).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* GRÁFICA */}
       <section>
        <h1 className="text-2xl font-bold text-white border-l-4 border-orange-500 pl-3">
          Evolucion de Creadores de contenido
        </h1>
        <p className="text-sm text-white/60 mt-1 ml-4">
         Cantidad de publicaciones por dia
        </p>
      </section>
      <section>
        {session?.backendToken && <ContentChart token={session.backendToken} />}
      </section>
    </div>
  );
}
