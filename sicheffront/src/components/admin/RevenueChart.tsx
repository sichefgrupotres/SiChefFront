export default function RevenueChart() {
  return (
    <section className="bg-[#2a221b] rounded-xl p-4 border border-white/10">
      <div className="flex justify-between mb-4">
        <div>
          <p className="font-semibold">Tendencia de Ingresos</p>
          <p className="text-xs text-white/50">Últimos 7 días</p>
        </div>

        <span className="text-sm text-orange-400">
          +15% Total
        </span>
      </div>

      <div className="h-32 rounded-lg bg-gradient-to-b from-orange-500/20 to-transparent flex items-center justify-center text-white/30">
        Gráfica
      </div>
    </section>
  );
}
