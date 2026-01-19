import { SubscriptionStatus } from "@/types/suscription";


export function StatusBadge({ status }: { status: SubscriptionStatus }) {
  const map = {
    active: "bg-green-500/20 text-green-400",
    trialing: "bg-blue-500/20 text-blue-400",
    canceled: "bg-red-500/20 text-red-400",
    incomplete: "bg-gray-500/20 text-gray-400",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status]}`}
    >
      {status.toUpperCase()}
    </span>
  );
}
