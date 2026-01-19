"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PaymentStat from "@/components/admin/payments/PaymentStat";
import TransactionItem from "@/components/admin/payments/TransactionItem";

export default function AdminPaymentsPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalMonthly: 0,
    activeSubscriptions: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPayments() {
      if (!session?.backendToken) return;

      try {
        // Esta ruta debe devolver las suscripciones de tu tabla Subscription en TypeORM
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/admin/all`,
          {
            headers: { Authorization: `Bearer ${session.backendToken}` },
          },
        );

        const data = await response.json(); // Array de Subscription entities

        // Cálculos basados en tus entidades de TypeORM
        const total = data.reduce((acc: number, sub: any) => {
          // Si es mensual suma 9.99, si es anual 99.99 (ejemplo)
          return acc + (sub.plan === "MONTHLY" ? 9.99 : 99.99);
        }, 0);

        const actives = data.filter(
          (sub: any) => sub.status === "active" || sub.status === "trialing",
        ).length;

        setStats({ totalMonthly: total, activeSubscriptions: actives });
        setTransactions(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, [session]);

  return (
    <div className="flex flex-col gap-8 p-4 pb-28 bg-[#181411] min-h-screen text-white">
      <header className="border-l-4 border-orange-500 pl-4">
        <h1 className="text-2xl font-bold uppercase">
          Ingresos de Suscripciones
        </h1>
        <p className="text-sm text-white/50">Datos sincronizados con Stripe</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PaymentStat
          title="MRR (Ingreso Mensual)"
          value={`$${stats.totalMonthly.toFixed(2)}`}
        />
        <PaymentStat
          title="Usuarios Premium"
          value={stats.activeSubscriptions.toString()}
        />
      </div>

      <section className="bg-[#2a221b] rounded-2xl p-6 border border-white/5">
        <h2 className="text-lg font-bold mb-6">Historial de Suscriptores</h2>
        <div className="space-y-4">
          {transactions.map((sub: any) => (
            <TransactionItem
              key={sub.id}
              // Accedemos a sub.user porque tu repo de NestJS lo trae en la relación
              user={sub.user?.name || "Usuario Desconocido"}
              email={sub.user?.email || "Sin email"}
              plan={sub.plan}
              status={sub.status}
              // Formateamos la fecha del fin de periodo actual
              date={new Date(sub.currentPeriodEnd).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
