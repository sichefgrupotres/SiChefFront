import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Link from "next/link";

interface UserCardProps {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  onRoleChange: (newRole: string) => void;
  onBlockToggle: (blocked: boolean) => void;
  blocked?: boolean;
}

export default function UserCard({
  id,
  name,
  email,
  role,
  status,
  onRoleChange,
  onBlockToggle,
  blocked = false,
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

  // 🔹 SOLO ESTILOS: color según rol
  const roleColorClass =
    role === "ADMIN"
      ? "text-orange-600"
      : role === "CREATOR"
      ? "text-orange-400"
      : "text-orange-300";

  const profilePathByRole = () => {
    switch (role) {
      case "ADMIN":
        return `/admin/users/${id}`;
      case "CREATOR":
        return `/admin/creators/${id}`;
      default:
        return `/admin/clients/${id}`;
    }
  };

  return (
    <div
      className="
        flex flex-col justify-between h-full w-full items-center text-center
        bg-[#2a221b] rounded-xl p-5
        border border-orange-500/60
        hover:border-orange-500
        shadow-md hover:shadow-orange-500/30
        transition
      "
    >
      {/* INFO USUARIO */}
      <div className="mb-4">
        <Link href={profilePathByRole()}>
          <h3 className="text-orange-500 font-bold text-lg cursor-pointer hover:underline mb-2">
            {name}
          </h3>
        </Link>

        <p className="text-white/60 text-sm">
          <span className="font-bold text-white">Email:</span> {email}
        </p>
        <p className="text-white/60 text-sm">
          <span className="font-bold text-white">Rol:</span> {role}
        </p>
        <p className="text-white/60 text-sm">
          <span className="font-bold text-white">Estado:</span> {status}
        </p>
      </div>

      {/* ACCIONES */}
      <div className="flex gap-2 w-full">
        <select
          value={role}
          onChange={handleRoleChange}
          className={`
            flex-1
            bg-[#181411]
            ${roleColorClass}
            px-3 py-2
            rounded
            text-sm
            font-semibold
            border border-white/10
            focus:outline-none
            focus:border-orange-500
          `}
        >
          <option value="USER" className="text-orange-300">
            USER
          </option>
          <option value="CREATOR" className="text-orange-400">
            CREATOR
          </option>
          <option value="ADMIN" className="text-orange-600">
            ADMIN
          </option>
        </select>

        <button
          style={{ backgroundColor: isBlocked ? "#28af23" : "#bd0707" }}
          className="
            flex-3
            px-3 py-2
            rounded
            text-white
            font-semibold
            text-sm
          "
          onClick={handleBlockToggle}
        >
          {isBlocked ? "Desbloquear" : "Bloquear"}
        </button>
      </div>
    </div>
  );
}




