export default function StatusBadge({ status }: any) {
  if (status === "SPAM") {
    return (
      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
        Reportado: Spam
      </span>
    );
  }

  return null;
}
