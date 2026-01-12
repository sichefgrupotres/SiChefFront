interface Props {
  title: string;
  value: string;
  icon: string;
  variation?: string;
  alert?: boolean;
}

export default function MetricCard({
  title,
  value,
  icon,
  variation,
  alert,
}: Props) {
  return (
    <div className="bg-[#2a221b] rounded-xl p-4 border border-white/10">
      <div className="flex justify-between items-start">
        <span
          className={`material-symbols-outlined ${
            alert ? "text-red-400" : "text-orange-500"
          }`}
        >
          {icon}
        </span>

        {variation && (
          <span className="text-xs text-green-400">
            {variation}
          </span>
        )}
      </div>

      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className="text-sm text-white/50">{title}</p>
    </div>
  );
}
