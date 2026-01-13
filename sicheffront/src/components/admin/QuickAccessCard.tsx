interface QuickAccessCardProps {
  icon: string;
  label: string;
  value?: string | number; // Para mostrar métricas
  onClick?: () => void;
  alert?: boolean; // Para marcar algo urgente
}

export default function QuickAccessCard({
  icon,
  label,
  value,
  onClick,
  alert = false,
}: QuickAccessCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex flex-col items-center justify-center gap-2 p-4 rounded-xl
        bg-[#2a221b] text-white hover:bg-[#3a2f26] transition
        ${alert ? "border-2 border-red-600" : ""}
      `}
    >
      <span className="material-symbols-outlined text-4xl text-orange-500">
        {icon}
      </span>
      <span className="text-sm text-white/70">{label}</span>
      {value && <span className="text-xl font-bold">{value}</span>}
    </button>
  );
}

