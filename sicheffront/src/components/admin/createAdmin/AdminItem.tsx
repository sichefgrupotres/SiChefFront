export default function AdminItem({ name, role, date }: any) {
  return (
    <div className="flex items-center justify-between bg-[#2a221b] border border-white/10 rounded-lg px-4 py-3">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-xs text-white/50">
          {role} • {date}
        </p>
      </div>

      <div className="flex gap-2 text-white/60">
        <button className="hover:text-white">
          <span className="material-symbols-outlined">edit</span>
        </button>
        <button className="hover:text-red-400">
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>
    </div>
  );
}
