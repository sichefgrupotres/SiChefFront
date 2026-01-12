"use client";

import AdminList from "@/components/admin/createAdmin/AdminList";
import CreateAdminForm from "@/components/admin/createAdmin/CreateAdminForm";


export default function CreateAdminPage() {
  return (
    <div
      className="
        flex flex-col gap-12
        p-4 pb-28
        bg-[#181411] min-h-screen
        px-4 sm:px-8 lg:px-16
      "
    >
      {/* HEADER */}
      <section>
        <h1 className="text-2xl font-bold text-white border-l-4 border-orange-500 pl-3">
          Crear administradores
        </h1>
        <p className="text-sm text-white/60 mt-1 ml-4">
          Gestión de usuarios con permisos administrativos
        </p>
      </section>

      {/* FORM */}
      <section className="bg-[#2a221b] border border-white/10 rounded-xl p-6 max-w-2xl">
        <CreateAdminForm />
      </section>

      {/* LIST */}
      <section className="max-w-2xl">
        <AdminList/>
      </section>
    </div>
  );
}

