"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import UserSearch from "@/components/admin/users/UserSearch";
import UserCard from "@/components/admin/users/UserCard";
import { adminService } from "@/services/admin.services";

import {
  Users,
  User,
  Shield,
  Crown,
  UserCheck,
  UserX,
} from "lucide-react";

type RoleId = "USER" | "CREATOR" | "ADMIN" | "SUSCRIPTOR";

interface UserType {
  id: string;
  name: string;
  email: string;
  roleId: RoleId;
  blocked: boolean;
  status: string;
  avatarUrl: string;
}

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");

  const [roleFilter, setRoleFilter] = useState<"Todos" | RoleId>("Todos");
  const [statusFilter, setStatusFilter] = useState<"TODOS" | "ACTIVOS" | "BLOQUEADOS">("TODOS");

  // ================= FETCH =================
  const fetchUsers = async () => {
    if (!session?.backendToken) return;
    setLoading(true);
    try {
      const data = await adminService.getAllUsers(session.backendToken);
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [session]);

  // ================= SINCRONIZAR CON URL =================
  useEffect(() => {
    const role = searchParams.get("role");
    const status = searchParams.get("status");

    if (role && ["USER", "CREATOR", "ADMIN", "SUSCRIPTOR"].includes(role)) {
      setRoleFilter(role as RoleId);
    }

    if (status === "blocked") {
      setStatusFilter("BLOQUEADOS");
    }

    if (!role && !status) {
      setRoleFilter("Todos");
      setStatusFilter("TODOS");
    }
  }, [searchParams]);

  // ================= FILTRO Y ORDEN FINAL =================
  const displayedUsers = users
    .filter((u) =>
      searchEmail ? u.email.toLowerCase().includes(searchEmail.toLowerCase()) : true
    )
    .filter((u) => (roleFilter === "Todos" ? true : u.roleId === roleFilter))
    .filter((u) => {
      if (statusFilter === "ACTIVOS") return !u.blocked;
      if (statusFilter === "BLOQUEADOS") return u.blocked;
      return true;
    })
    .sort((a, b) => {
      // Activos primero, bloqueados después
      if (a.blocked && !b.blocked) return 1;
      if (!a.blocked && b.blocked) return -1;

      // Luego orden alfabético por nombre
      return a.name.localeCompare(b.name);
    });

  // ================= HANDLERS =================
 const handleRoleChange = async (userId: string, newRole: RoleId) => {
  if (!session?.backendToken) return;

  const result = await adminService.updateUserRole(
    userId,
    newRole,
    session.backendToken
  );

  if (!result.ok) {
    console.warn("Cambio de rol rechazado");
    return;
  }

  // ✅ backend OK → actualizamos UI
  setUsers((prev) =>
    prev.map((u) =>
      u.id === userId ? { ...u, roleId: newRole } : u
    )
  );
};

 const handleBlockToggle = async (userId: string, blocked: boolean) => {
  if (!session?.backendToken) return;

  try {
    await adminService.blockUser(userId, blocked, session.backendToken);

    setUsers((prev) => {
      const updated = prev.map((u) =>
        u.id === userId ? { ...u, blocked } : u
      );

      // 🔹 reordenamos inmediatamente
      return [...updated].sort((a, b) => {
        if (a.blocked && !b.blocked) return 1;
        if (!a.blocked && b.blocked) return -1;
        return a.name.localeCompare(b.name);
      });
    });
  } catch (err) {
    console.error("Error cambiando estado de bloqueo:", err);
  }
};
  const FilterButton = ({
    active,
    onClick,
    icon: Icon,
    label,
  }: {
    active: boolean;
    onClick: () => void;
    icon: any;
    label: string;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition
        ${active ? "bg-orange-500 text-black" : "bg-white/10 text-white hover:bg-white/20"}`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <div className="flex flex-col gap-8 p-4 pb-28 bg-[#181411] min-h-screen px-4 sm:px-8 lg:px-16">
      <header>
        <h1 className="text-2xl font-bold text-white border-l-4 border-orange-500 pl-3">
          Gestión de Usuarios
        </h1>
        <p className="text-sm text-white/60 mt-1 ml-4">
          Directorio de usuarios registrados
        </p>
      </header>

      <UserSearch
        value={searchEmail}
        onChange={(e) => setSearchEmail(e.target.value)}
        onSubmit={() => {}}
      />

      {/* FILTROS */}
      <div className="flex flex-wrap gap-2">
        <FilterButton
          label="Todos"
          icon={Users}
          active={roleFilter === "Todos"}
          onClick={() => {
            setRoleFilter("Todos");
            setStatusFilter("TODOS");
            router.push("/admin/users");
          }}
        />
        <FilterButton
          label="Usuarios"
          icon={User}
          active={roleFilter === "USER"}
          onClick={() => setRoleFilter("USER")}
        />
        <FilterButton
          label="Creadores"
          icon={Crown}
          active={roleFilter === "CREATOR"}
          onClick={() => setRoleFilter("CREATOR")}
        />
        <FilterButton
          label="Suscriptores"
          icon={UserCheck}
          active={roleFilter === "SUSCRIPTOR"}
          onClick={() => setRoleFilter("SUSCRIPTOR")}
        />
        <FilterButton
          label="Activos"
          icon={UserCheck}
          active={statusFilter === "ACTIVOS"}
          onClick={() => setStatusFilter("ACTIVOS")}
        />
        <FilterButton
          label="Bloqueados"
          icon={UserX}
          active={statusFilter === "BLOQUEADOS"}
          onClick={() => setStatusFilter("BLOQUEADOS")}
        />
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-white/60">Cargando usuarios...</p>
        ) : displayedUsers.length === 0 ? (
          <p className="text-white/60">No se encontraron usuarios.</p>
        ) : (
          displayedUsers.map((user) => (
            <UserCard
              key={user.id}
              id={user.id}
              name={user.name}
              email={user.email}
              role={user.roleId}
              avatarUrl={user.avatarUrl}
              status={user.blocked ? "BLOQUEADO" : "ACTIVO"}
              blocked={user.blocked}
              onRoleChange={(newRole) => handleRoleChange(user.id, newRole as RoleId)}
              onBlockToggle={(blocked) => handleBlockToggle(user.id, blocked)}
            />
          ))
        )}
      </section>
    </div>
  );
}
