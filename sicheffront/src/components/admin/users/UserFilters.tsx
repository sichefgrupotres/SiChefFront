"use client";

interface UserFiltersProps {
  filter: "Todos" | "USER" | "CREATOR" | "SUSCRIPTOR";
  setFilter: (value: "Todos" | "USER" | "CREATOR" | "SUSCRIPTOR") => void;
}

export default function UserFilters({ filter, setFilter }: UserFiltersProps) {
  return (
    <div className="flex gap-3 mb-4">
      <FilterButton
        active={filter === "Todos"}
        onClick={() => setFilter("Todos")}
        icon="expand_more"
      >
        Todos
      </FilterButton>

      <FilterButton
        active={filter === "USER"}
        onClick={() => setFilter("USER")}
        icon="person"
      >
        Registrados
      </FilterButton>

      <FilterButton
        active={filter === "CREATOR"}
        onClick={() => setFilter("CREATOR")}
        icon="how_to_reg"
      >
        Creadores
      </FilterButton>

      <FilterButton
        active={filter === "SUSCRIPTOR"}
        onClick={() => setFilter("SUSCRIPTOR")}
        icon="star"
      >
        Suscriptores
      </FilterButton>
    </div>
  );
}

function FilterButton({
  children,
  icon,
  active = false,
  onClick,
}: {
  children: React.ReactNode;
  icon?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition
        ${
          active
            ? "bg-orange-500 text-white/80 font-semibold"
            : "bg-[#2a221b] text-white/70 border border-white/10 hover:bg-white/5"
        }
      `}
    >
      {children}
      {icon && (
        <span className="material-symbols-outlined text-sm">{icon}</span>
      )}
    </button>
  );
}
