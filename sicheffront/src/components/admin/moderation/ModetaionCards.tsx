import StatusBadge from "./StatusBadge";

export default function ModerationCard({
  title,
  author,
  time,
  comment,
  status,
}: any) {
  return (
    <div
      className={`border rounded-xl p-4 ${
        status === "SPAM"
          ? "border-red-500/30 bg-red-500/5"
          : "border-white/10 bg-[#2a221b]"
      }`}
    >
      <div className="flex justify-between mb-2">
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-xs text-white/50">
            {author} • {time}
          </p>
        </div>

        <StatusBadge status={status} />
      </div>

      <p className="text-sm text-white/70 mb-4">"{comment}"</p>

      <div className="flex gap-3">
        <button className="flex-1 bg-green-500 hover:bg-green-600 rounded-lg py-2">
          Aprobar
        </button>
        <button className="flex-1 bg-white/5 hover:bg-red-500 rounded-lg py-2">
          Eliminar
        </button>
      </div>
    </div>
  );
}
