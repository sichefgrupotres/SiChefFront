"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Link from "next/link";
import Image from "next/image";

interface UserCardProps {
  id: string;
  name: string;
  email: string;
  role: "USER" | "CREATOR" | "ADMIN" | "SUSCRIPTOR";
  status: string;
  createdAt?: string;
  avatarUrl?: string;
  blocked?: boolean;
  onRoleChange: (newRole: string) => void;
  onBlockToggle: (blocked: boolean) => void;
}

export default function UserCard({
  id,
  name,
  email,
  role,
  status,
  createdAt,
  avatarUrl,
  blocked = false,
  onRoleChange,
  onBlockToggle,
}: UserCardProps) {
  const [isBlocked, setIsBlocked] = useState(blocked);

  useEffect(() => {
    setIsBlocked(blocked);
  }, [blocked]);

  const handleBlockToggle = async () => {
    const nextBlocked = !isBlocked;

    const result = await Swal.fire({
      title: nextBlocked ? "¿Bloquear usuario?" : "¿Desbloquear usuario?",
      text: nextBlocked
        ? "El usuario no podrá acceder al sistema"
        : "El usuario podrá volver a acceder",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: nextBlocked ? "#bd0707" : "#28af23",
      cancelButtonColor: "#555",
      confirmButtonText: nextBlocked ? "Sí, bloquear" : "Sí, desbloquear",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    setIsBlocked(nextBlocked);
    onBlockToggle(nextBlocked);
  };

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;

    const result = await Swal.fire({
      title: "¿Cambiar rol?",
      text: `¿Deseás cambiar el rol del usuario a ${newRole}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#555",
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) {
      e.target.value = role;
      return;
    }

    onRoleChange(newRole);
  };

  const roleColorClass =
    role === "ADMIN"
      ? "text-orange-600"
      : role === "CREATOR"
        ? "text-orange-400"
        : role === "SUSCRIPTOR"
          ? "text-orange-500"
          : "text-orange-300";

  // MODIFICACIÓN: El administrador siempre va a la ruta de gestión de usuarios
  // sin importar el rol del usuario que esté mirando.
  const adminDetailPath = `/admin/users/${id}`;

  return (
    <div
      className="
        flex flex-col justify-between h-full w-full items-center text-center
        bg-[#2a221b] rounded-3xl p-6
        border border-orange-500/60
        hover:border-orange-500
        shadow-md hover:shadow-orange-500/30
        transition
      "
    >
      {/* FOTO + INFO */}
      <div className="flex flex-col items-center text-center mb-4">
        <div className="relative mb-4 w-20 h-20 rounded-full border-4 border-[#F57C00] overflow-hidden">
          <Image
            src={avatarUrl || "/chef-avatar.jpg"}
            alt={name}
            fill
            className="object-cover"
          />
        </div>

        {/* CLICK EN EL NOMBRE LLEVA AL PERFIL DE GESTIÓN */}
        <Link href={adminDetailPath}>
          <h3 className="text-orange-500 font-bold text-base cursor-pointer hover:underline transition-all hover:scale-105">
            {name}
          </h3>
        </Link>

        <p className="text-white/60 text-xs">{email}</p>
      </div>

      {/* MÉTRICAS */}
      <div className="flex gap-2 w-full mb-2">
        <div className="bg-[#181411] rounded-xl p-2 text-center flex-1">
          <p className="text-[10px] text-white/50">ESTADO</p>
          <p
            className={`text-sm font-semibold ${
              isBlocked ? "text-red-400" : "text-green-400"
            }`}
          >
            {isBlocked ? "BLOQUEADO" : "ACTIVO"}
          </p>
        </div>

        {createdAt && (
          <div className="bg-[#181411] rounded-xl p-2 text-center flex-1">
            <p className="text-[10px] text-white/50">REGISTRO</p>
            <p className="text-sm font-semibold text-white/80">
              {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
        )}

        <div className="bg-[#181411] rounded-xl p-2 text-center flex-1">
          <p className="text-[10px] text-white/50">ROL</p>
          <p className={`text-sm font-semibold ${roleColorClass}`}>{role}</p>
        </div>
      </div>

      {/* ACCIONES */}
      <div className="flex flex-row gap-2 w-full mt-2">
        <select
          value={role}
          onChange={handleRoleChange}
          className={`
            flex-1
            bg-[#181411]
            ${roleColorClass}
            px-2 py-1
            rounded
            text-xs
            font-semibold
            border border-white/10
            focus:outline-none
            focus:border-orange-500
            cursor-pointer
          `}
        >
          <option value="USER">USER</option>
          <option value="CREATOR">CREATOR</option>
          <option value="ADMIN">ADMIN</option>
          <option value="SUSCRIPTOR">SUSCRIPTOR</option>
        </select>

        <button
          style={{ backgroundColor: isBlocked ? "#28af23" : "#bd0707" }}
          className="
            flex-1
            px-2 py-1
            rounded
            text-white
            font-semibold
            text-xs
            transition-all
            hover:opacity-90
            active:scale-95
          "
          onClick={handleBlockToggle}
        >
          {isBlocked ? "Desbloquear" : "Bloquear"}
        </button>
      </div>
    </div>
  );
}
