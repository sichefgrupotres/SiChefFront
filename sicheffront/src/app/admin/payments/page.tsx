"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Crown, Ban, RefreshCcw } from "lucide-react";
import { StatCard } from "@/components/admin/payments/StatCard";
import { StatusBadge } from "@/components/admin/moderation/StatusBadge";
import { SubscriptionStatus } from "@/types/suscription";

/* =======================
   TIPOS
======================= */

type Subscription = {
  id: string;
  plan: "MONTHLY" | "YEARLY";
  status: SubscriptionStatus;
  currentPeriodEnd: string;
  user?: {
    name: string;
    email: string;
  };
};

/* =======================
   PAGE
======================= */

export default function AdminSubscriptionsPage() {
  const { data: session } = useSession();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<SubscriptionStatus | "all">("all");

  /* =======================
     FETCH
  ======================= */

  useEffect(() => {
    if (!session?.backendToken) return;

    const fetchSubscriptions = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/admin/all`,
          {
            headers: {
              Authorization: `Bearer ${session.backendToken}`,
            },
          },
        );

        const data: Subscription[] = await res.json();
        setSubscriptions(data);
      } catch (error) {
        console.error("Error cargando suscripciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [session]);

  /* =======================
     STATS
  ======================= */

  const stats = useMemo(() => {
    const activeSubs = subscriptions.filter(
      (s) => s.status === "active" || s.status === "trialing",
    );

    const mrr = activeSubs.reduce((acc, s) => {
      return acc + (s.plan === "MONTHLY" ? 9.99 : 99.99 / 12);
    }, 0);

    return {
      activeCount: activeSubs.length,
      mrr,
    };
  }, [subscriptions]);

  /* =======================
     FILTRO
  ======================= */

  const filteredSubs = useMemo(() => {
    if (filter === "all") return subscriptions;
    return subscriptions.filter((s) => s.status === filter);
  }, [subscriptions, filter]);

  /* =======================
     CANCELAR
  ======================= */

  const cancelSubscription = async (id: string) => {
    if (!session?.backendToken) return;
    if (!confirm("¿Cancelar esta suscripción?")) return;

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/admin/${id}/cancel`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.backendToken}`,
          },
        },
      );

      setSubscriptions((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, status: "canceled" } : s,
        ),
      );
    } catch (error) {
      console.error("Error cancelando suscripción:", error);
    }
  };

  /* =======================
     UI
  ======================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#181411] flex items-center justify-center text-white">
        Cargando suscripciones…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#181411] text-white p-6 space-y-8">
      {/* HEADER */}
      <header className="border-l-4 border-orange-500 pl-4">
        <h1 className="text-2xl font-bold uppercase">
          Gestión de Suscripciones
        </h1>
        <p className="text-sm text-white/50">
          Control total de planes Premium
        </p>
      </header>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <StatCard
          title="Usuarios Premium"
          value={stats.activeCount}
          icon={<Crown className="text-orange-400" />}
        />
        <StatCard
          title="MRR estimado"
          value={`$${stats.mrr.toFixed(2)}`}
          icon={<RefreshCcw className="text-orange-400" />}
        />
      </div>

      {/* FILTER */}
      <div className="flex gap-3 flex-wrap">
        {(["all", "active", "trialing", "canceled"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm border transition
              ${
                filter === s
                  ? "bg-orange-500/20 border-orange-500 text-orange-400"
                  : "border-white/10 text-white/60 hover:border-orange-500/40"
              }`}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <section className="bg-[#2a221b] rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/20 text-white/70">
            <tr>
              <th className="text-left px-4 py-3">Usuario</th>
              <th className="text-left px-4 py-3">Plan</th>
              <th className="text-left px-4 py-3">Estado</th>
              <th className="text-left px-4 py-3">Renueva</th>
              <th className="text-right px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubs.map((sub) => (
              <tr
                key={sub.id}
                className="border-t border-white/5 hover:bg-white/5"
              >
                <td className="px-4 py-3">
                  <div className="font-semibold">
                    {sub.user?.name ?? "—"}
                  </div>
                  <div className="text-xs text-white/50">
                    {sub.user?.email ?? ""}
                  </div>
                </td>

                <td className="px-4 py-3">
                  {sub.plan === "MONTHLY" ? "Mensual" : "Anual"}
                </td>

                <td className="px-4 py-3">
                  <StatusBadge status={sub.status} />
                </td>

                <td className="px-4 py-3">
                  {new Date(sub.currentPeriodEnd).toLocaleDateString("es-ES")}
                </td>

                <td className="px-4 py-3 text-right">
                  {(sub.status === "active" ||
                    sub.status === "trialing") && (
                    <button
                      onClick={() => cancelSubscription(sub.id)}
                      className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 text-xs"
                    >
                      <Ban size={14} />
                      Cancelar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredSubs.length === 0 && (
          <div className="p-6 text-center text-white/50">
            No hay suscripciones para este filtro
          </div>
        )}
      </section>
    </div>
  );
}

