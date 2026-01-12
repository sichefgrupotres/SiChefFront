export default function ModerationTabs({ tab, setTab }: any) {
  return (
    <div className="flex gap-2 bg-[#2a221b] p-1 rounded-lg w-fit">
      <Tab active={tab === "pending"} onClick={() => setTab("pending")}>
        Pendientes (12)
      </Tab>
      <Tab active={tab === "reported"} onClick={() => setTab("reported")}>
        Reportados (4)
      </Tab>
    </div>
  );
}

function Tab({ active, children, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm transition ${
        active
          ? "bg-orange-500 text-white"
          : "text-white/60 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
