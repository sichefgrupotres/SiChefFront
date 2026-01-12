interface Props {
  period?: string;
  average?: string;
}

export default function IncomeChart({
  period = "Ene - Jun",
  average = "$24,800",
}: Props) {
  return (
    <section className="bg-[#2a221b] rounded-xl p-4 border border-white/10 space-y-4">
      
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold">
            Ingresos Membresía Premium
          </p>
          <p className="text-xs text-white/50">
            Promedio mensual
          </p>
        </div>

        <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded">
          {period}
        </span>
      </div>

      <p className="text-3xl font-bold">
        {average}
      </p>

      {/* BARS PLACEHOLDER */}
      <div className="flex items-end gap-3 h-32">
        <Bar height="40%" />
        <Bar height="55%" />
        <Bar height="70%" />
        <Bar height="60%" />
        <Bar height="85%" active />
      </div>

      <div className="flex justify-between text-xs text-white/40">
        <span>ENE</span>
        <span>FEB</span>
        <span>MAR</span>
        <span>ABR</span>
        <span className="text-orange-400">JUN</span>
      </div>
    </section>
  );
}

/* SUBCOMPONENTE */

function Bar({
  height,
  active = false,
}: {
  height: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex-1 rounded-t-lg ${
        active
          ? "bg-orange-500"
          : "bg-orange-500/40"
      }`}
      style={{ height }}
    />
  );
}
