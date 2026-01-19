interface TransactionProps {
  user: string;      // El nombre del usuario
  email: string;     // El email del usuario
  plan: "MONTHLY" | "YEARLY";
  status: string;    // 'active', 'trialing', 'canceled', etc.
  date: string;      // Fecha formateada
}

export default function TransactionItem({ user, email, plan, status, date }: TransactionProps) {
  const isSuccess = status === 'active' || status === 'trialing';

  return (
    <div className="flex items-center justify-between p-4 bg-[#181411] rounded-xl border border-white/5 hover:border-orange-500/30 transition-all">
      <div className="flex items-center gap-4">
        {/* Avatar simple o inicial */}
        <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold">
          {user[0].toUpperCase()}
        </div>
        
        <div>
          <h4 className="font-bold text-sm text-white">{user}</h4>
          <p className="text-xs text-white/40">{email}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-xs font-bold text-orange-400">{plan}</p>
          <p className="text-[10px] text-white/30">{date}</p>
        </div>

        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
          isSuccess ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
        }`}>
          {status.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
