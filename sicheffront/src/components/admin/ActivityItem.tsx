interface Props {
  title: string;
  subtitle: string;
  status: "PENDIENTE" | "COMPLETADO" | "URGENTE";
}

const statusStyles = {
  PENDIENTE: "bg-yellow-500/20 text-yellow-400",
  COMPLETADO: "bg-green-500/20 text-green-400",
  URGENTE: "bg-red-500/20 text-red-400",
};

export default function ActivityItem({
  title,
  subtitle,
  status,
}: Props) {
  return (
    <div className="bg-[#2a221b] rounded-xl p-4 border border-white/10 flex justify-between items-center">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-white/50">{subtitle}</p>
      </div>

      <span
        className={`text-xs px-2 py-1 rounded ${statusStyles[status]}`}
      >
        {status}
      </span>
    </div>
  );
}
