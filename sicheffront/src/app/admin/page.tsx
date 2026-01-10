"use client";

import { useAuth } from "@/context/AuthContext";

export default function AdminDashboard() {
  const { dataUser } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#181411] text-[#e6e0db]">

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="h-16 bg-[#1E1B18]/80 backdrop-blur border-b border-white/10 flex items-center justify-between px-6">
          <h1 className="font-bold text-lg">Panel de Administración</h1>

          <div className="flex items-center gap-4">
            <button className="relative">
              <span className="material-symbols-outlined text-white/60">
                notifications
              </span>
              <span className="absolute top-0 right-0 size-2 bg-red-500 rounded-full" />
            </button>

            <div className="size-9 rounded-full bg-[#F57C00] text-black flex items-center justify-center font-bold">
              {dataUser?.user?.name?.[0] ?? "A"}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 space-y-10">

          {/* STATS */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Usuarios" value="24.5k" icon="group" />
            <StatCard title="Pendientes" value="18" icon="pending_actions" />
            <StatCard title="Suscripciones" value="892" icon="workspace_premium" />
            <StatCard title="Reportes" value="5" icon="report" alert />
          </section>

          {/* MODERACIÓN */}
          <section className="bg-[#2a221b] rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[#F57C00]">
                  fact_check
                </span>
                Moderación Pendiente
              </h2>
              <button className="text-sm text-[#F57C00] hover:underline">
                Ver todo
              </button>
            </div>

            <ModerationItem
              type="Receta"
              title="Risotto de setas"
              author="Chef Mario"
              time="Hace 2h"
            />

            <ModerationItem
              type="Tutorial"
              title="Corte Julienne"
              author="Ana Cocina"
              time="Hace 4h"
            />
          </section>

          {/* GESTIÓN */}
          <section>
            <h2 className="font-semibold mb-3">Gestión rápida</h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <QuickAction icon="manage_accounts" label="Usuarios" />
              <QuickAction icon="payments" label="Pagos" />
              <QuickAction icon="campaign" label="Comunicados" />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

/* COMPONENTES */

function SidebarItem({ icon, label, active = false }: any) {
  return (
    <button
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition
      ${active ? "bg-[#F57C00]/20 text-[#F57C00]" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
    >
      <span className="material-symbols-outlined">{icon}</span>
      {label}
    </button>
  );
}

function StatCard({ title, value, icon, alert }: any) {
  return (
    <div className="bg-[#2a221b] rounded-xl p-4 border border-white/10">
      <div className="flex justify-between items-center">
        <p className="text-sm text-white/60">{title}</p>
        <span className={`material-symbols-outlined ${alert ? "text-red-400" : "text-[#F57C00]"}`}>
          {icon}
        </span>
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}

function ModerationItem({ type, title, author, time }: any) {
  return (
    <div className="flex justify-between items-center py-3 border-t border-white/10">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-white/50">
          {type} • {author} • {time}
        </p>
      </div>

      <div className="flex gap-2">
        <button className="p-2 rounded-lg hover:bg-green-500/20 text-green-500">
          <span className="material-symbols-outlined">check</span>
        </button>
        <button className="p-2 rounded-lg hover:bg-red-500/20 text-red-500">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>
  );
}

function QuickAction({ icon, label }: any) {
  return (
    <button className="bg-[#2a221b] rounded-xl p-4 border border-white/10 flex items-center gap-4 hover:bg-white/5 transition">
      <span className="material-symbols-outlined text-[#F57C00]">
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </button>
  );
}
