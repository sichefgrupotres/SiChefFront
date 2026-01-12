import { useState, useEffect } from "react";

interface UserCardProps {
  name: string;
  email: string;
  role: string;
  status: string;
  onRoleChange: (newRole: string) => void;
  onBlockToggle: (blocked: boolean) => void;
  blocked?: boolean;
}

export default function UserCard({
  name,
  email,
  role,
  status,
  onRoleChange,
  onBlockToggle,
  blocked = false,
}: UserCardProps) {
  // Estado local para manejar el cambio del botón
  const [isBlocked, setIsBlocked] = useState(blocked);

  // Si el prop 'blocked' cambia desde el padre, actualizar estado local
  useEffect(() => {
    setIsBlocked(blocked);
  }, [blocked]);

  const handleBlockToggle = () => {
    const newBlocked = !isBlocked;
    setIsBlocked(newBlocked); // Cambia el botón inmediatamente
    onBlockToggle(newBlocked); // Llama al backend
  };

  return (
    <div className="bg-[#2a221b] rounded-xl p-4 flex justify-between items-center">
      <div>
        <h3 className="text-white font-semibold">{name}</h3>
        <p className="text-white/60">{email}</p>
        <p className="text-white/60">Rol: {role}</p>
        <p className="text-white/60">Estado: {status}</p>
      </div>

      <div className="flex gap-2">
        {/* Cambiar rol */}
        <select
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          className="bg-[#181411] text-white px-2 py-1 rounded"
        >
          <option value="USER">USER</option>
          <option value="CREATOR">CREATOR</option>
          <option value="ADMIN">ADMIN</option>
        </select>

        {/* Bloquear / Desbloquear */}
        <button
          style={{ backgroundColor: isBlocked ? "#dc2626" : "#16a34a" }}
          className="px-3 py-1 rounded text-white font-semibold"
          onClick={handleBlockToggle} // ✅ solo llama a la función con el booleano correcto
        >
          {isBlocked ? "Desbloquear" : "Bloquear"}
        </button>
      </div>
    </div>
  );
}
