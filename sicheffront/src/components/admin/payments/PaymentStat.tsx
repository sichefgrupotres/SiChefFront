interface Props {
  title: string;
  value: string;
  variation?: string;
}

export default function PaymentStat({
  title,
  value,
  variation,
}: Props) {
  return (
    <div className="bg-[#2a221b] rounded-xl p-4 border border-white/10 space-y-2">
      <p className="text-xs text-white/50 uppercase">
        {title}
      </p>

      <p className="text-2xl font-bold">
        {value}
      </p>

      {variation && (
        <div className="flex items-center gap-1 text-green-400 text-sm">
          <span className="material-symbols-outlined text-sm">
            trending_up
          </span>
          {variation}
        </div>
      )}
    </div>
  );
}
