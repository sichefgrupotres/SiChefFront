"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import UserSearch from "@/components/admin/users/UserSearch";
import UserFilters from "@/components/admin/users/UserFilters";
import UserCard from "@/components/admin/users/UserCard";
import { adminService } from "@/services/admin.services";

interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  blocked: boolean;
  status: string;
}

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");
  const [filter, setFilter] = useState<"Todos" | "USER" | "CREATOR" | "SUSCRIPTOR">("Todos");

  // ================= FETCH USERS =================
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

  // ================= HANDLE ROLE CHANGE =================
  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!session?.backendToken) return;
    try {
      await adminService.updateUserRole(userId, newRole, session.backendToken);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, roleId: newRole } : u))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ================= HANDLE BLOCK TOGGLE =================
  const handleBlockToggle = async (userId: string, blocked: boolean) => {
    if (!session?.backendToken) return;
    try {
      await adminService.blockUser(userId, blocked, session.backendToken);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, blocked } : u))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ================= FILTERED USERS =================
  const displayedUsers = users
    .filter((u) => {
      // FILTRO POR EMAIL
      if (searchEmail) {
        return u.email.toLowerCase().includes(searchEmail.toLowerCase());
      }
      return true;
    })
    .filter((u) => {
      // FILTRO POR ROLE
      if (filter === "Todos") return true;
      return u.roleId === filter;
    });

  // ================= HANDLE SEARCH =================
  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    // Si el input está vacío, reinicia la búsqueda
    if (!searchEmail) setSearchEmail("");
  };

  return (
    <div className="flex flex-col gap-8 p-4 pb-28 bg-[#181411] min-h-screen px-4 sm:px-8 lg:px-16">
      {/* HEADER */}
      <header>
        <h1 className="text-2xl font-bold text-white border-l-4 border-orange-500 pl-3">
          Gestión de Usuarios
        </h1>
        <p className="text-sm text-white/60 mt-1 ml-4">
          Directorio de usuarios registrados
        </p>
      </header>

      {/* SEARCH */}
      <UserSearch
        value={searchEmail}
        onChange={(e) => setSearchEmail(e.target.value)}
        onSubmit={handleSearch}
      />

      {/* FILTERS */}
      <UserFilters filter={filter} setFilter={setFilter} />

      {/* LISTADO DE USUARIOS */}
      <section className="space-y-4">
        {loading ? (
          <p className="text-white/60">Cargando usuarios...</p>
        ) : displayedUsers.length === 0 ? (
          <p className="text-white/60">No se encontraron usuarios.</p>
        ) : (
          displayedUsers.map((user) => (
            <UserCard
              key={user.id}
              name={user.name}
              email={user.email}
              role={user.roleId}
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
