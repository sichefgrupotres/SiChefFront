"use client";

import PaymentStat from "@/components/admin/payments/PaymentStat";
import TransactionItem from "@/components/admin/payments/TransactionItem";

export default function AdminPaymentsPage() {
  return (
    <div
      className="
        flex flex-col gap-8
        p-4 pb-28
        bg-[#181411] min-h-screen
        px-4 sm:px-8 lg:px-16
      "
    >
      {/* HEADER */}
      <header>
        <h1 className="text-2xl font-bold text-white border-l-4 border-orange-500 pl-3">
          Control de Pagos
        </h1>
      </header>

      {/* STATS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#2a221b] border border-white/10 rounded-xl p-4">
          <PaymentStat
            title="Total Mensual"
            value="$12,450.00"
            variation="+12.5%"
          />
        </div>

        <div className="bg-[#2a221b] border border-white/10 rounded-xl p-4">
          <PaymentStat
            title="Suscripciones Activas"
            value="1,842"
            variation="+5.2%"
          />
        </div>
      </section>

      {/* TRANSACTIONS */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-orange-500 pl-3">
           Transacciones recientes
          </h2>

        <div className="space-y-3">
          <TransactionItem
            name="Carlos Ruiz"
            plan="Plan Gourmet Mensual"
            amount="$15.99"
            status="COMPLETADO"
          />

          <TransactionItem
            name="Elena Martínez"
            plan="Plan Anual Chef"
            amount="$129.00"
            status="PENDIENTE"
          />

          <TransactionItem
            name="Roberto Gómez"
            plan="Plan Gourmet Mensual"
            amount="$15.99"
            status="FALLIDO"
          />
        </div>
      </section>

      {/* ACTION */}
      <button
        className="
          mt-4 h-12 rounded-lg font-bold
          bg-[#F57C00] hover:bg-orange-500
          transition active:scale-95
        "
      >
        Exportar Reporte Mensual
      </button>
    </div>
  );
}
