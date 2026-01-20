"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import UserSearch from "@/components/admin/users/UserSearch";
import UserFilters from "@/components/admin/users/UserFilters";
import UserCard from "@/components/admin/users/UserCard";
import { adminService } from "@/services/admin.services";
import { SubscriptionStatus } from "@/types/next-auth";
type RoleId = "USER" | "CREATOR" | "ADMIN" | "SUSCRIPTOR";
interface User {
  id: string;
  name: string;
  email: string;
  roleId: RoleId
  blocked: boolean;
  status: string;
  avatarUrl: string;
}

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");
  const [filter, setFilter] = useState<
    "Todos" | "USER" | "CREATOR" | "SUSCRIPTOR" | "ADMIN"
  >("Todos");

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

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!session?.backendToken) return;
    try {
      await adminService.updateUserRole(userId, newRole, session.backendToken);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, roleId: newRole as RoleId } : u)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlockToggle = async (userId: string, blocked: boolean) => {
    if (!session?.backendToken) return;
    try {
      await adminService.blockUser(userId, blocked, session.backendToken);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, blocked } : u)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const displayedUsers = users
    .filter((u) =>
      searchEmail
        ? u.email.toLowerCase().includes(searchEmail.toLowerCase())
        : true,
    )
    .filter((u) => (filter === "Todos" ? true : u.roleId === filter))
    .sort((a, b) => {
      // Desbloqueados primero
      if (a.blocked !== b.blocked) {
        return a.blocked ? 1 : -1;
      }

      // Orden alfabético ASCENDENTE (A → Z)
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase(), "es", {
        sensitivity: "base",
      });
    });

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchEmail) setSearchEmail("");
  };

    const handleSubscriptionChange = async (
    userId: string,
    status: SubscriptionStatus
  ) => {
    if (!session?.backendToken) return;

    try {
      await adminService.updateUserSubscription(
        userId,
        status,
        session.backendToken
      );

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, subscriptionStatus: status } : u
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

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
        onSubmit={handleSearch}
      />

      <UserFilters filter={filter} setFilter={setFilter} />

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
              onRoleChange={(newRole) => handleRoleChange(user.id, newRole)}
              onBlockToggle={(blocked) => handleBlockToggle(user.id, blocked)}
            />
          ))
        )}
      </section>
    </div>
  );
}
