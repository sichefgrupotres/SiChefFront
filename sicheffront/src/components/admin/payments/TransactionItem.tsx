interface Props {
  name: string;
  plan: string;
  amount: string;
  status: "COMPLETADO" | "PENDIENTE" | "FALLIDO";
}

const statusStyles = {
  COMPLETADO: "bg-green-500/20 text-green-400",
  PENDIENTE: "bg-orange-500/20 text-orange-400",
  FALLIDO: "bg-red-500/20 text-red-400",
};

export default function TransactionItem({
  name,
  plan,
  amount,
  status,
}: Props) {
  return (
    <div className="bg-[#2a221b] rounded-xl p-4 border border-white/10 flex justify-between items-center">
      
      <div className="flex gap-3 items-center">
        <div className="size-10 rounded-full bg-orange-500/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-orange-400">
            person
          </span>
        </div>

        <div>
          <p className="font-medium">{name}</p>
          <p className="text-xs text-white/50">{plan}</p>
        </div>
      </div>

      <div className="text-right">
        <p className="font-semibold">{amount}</p>
        <span
          className={`text-xs px-2 py-1 rounded ${statusStyles[status]}`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}
