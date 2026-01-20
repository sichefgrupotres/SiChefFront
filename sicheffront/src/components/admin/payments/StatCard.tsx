export function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-[#2a221b] rounded-2xl p-6 border border-white/5 flex items-center justify-between">
      <div>
        <p className="text-sm text-white/50">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
      {icon}
    </div>
  );
}