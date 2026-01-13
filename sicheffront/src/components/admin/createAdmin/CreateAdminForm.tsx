"use client";

import { useState } from "react";

export default function CreateAdminForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <form className="flex flex-col gap-4">
        {/* Nombre */}
        <div>
          <label className="text-sm font-semibold">
            Nombre completo
          </label>
          <input
            type="text"
            placeholder="Ej: Juan Pérez"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full mt-1 rounded-lg bg-[#2a221b] border border-white/10 px-5 py-3 outline-none focus:border-primary"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-semibold">
            Correo electrónico
          </label>
          <input
            type="email"
            placeholder="admin@sichef.com"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full mt-1 rounded-lg bg-[#2a221b] border border-white/10 px-5 py-3 outline-none focus:border-primary"
          />
        </div>

        {/* Rol */}
        <div>
          <label className="text-sm font-semibold">
            Nivel de permisos
          </label>
          <select
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
            className="w-full mt-1 rounded-lg bg-[#2a221b] border border-white/10 px-5 py-3"
          >
            <option value="">Seleccionar rol</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="MODERATOR">Moderador</option>
            <option value="MANAGER">Gestor</option>
          </select>
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-semibold">
            Contraseña temporal
          </label>
          <input
            type="password"
            placeholder="********"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full mt-1 rounded-lg bg-[#2a221b] border border-white/10 px-5 py-3 outline-none focus:border-primary"
          />
        </div>

        {/* Submit */}
        <button
          type="button"
          className="mt-4 h-12 rounded-lg font-bold bg-[#F57C00] hover:bg-orange-500 transition active:scale-95"
        >
          Crear administrador
        </button>
      </form>
    </div>
  );
}
