import AdminItem from "./AdminItem";

export default function AdminList() {
  return (
    <section className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-orange-500 pl-3">
            Administradores Actuales
          </h2>

        <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full">
          3 TOTAL
        </span>
      </div>

      <div className="space-y-3">
        <AdminItem
          name="María Almagro"
          role="Super Admin"
          date="12 Oct 2023"
        />
        <AdminItem
          name="Ricardo Gómez"
          role="Moderador"
          date="05 Nov 2023"
        />
        <AdminItem
          name="Carla López"
          role="Gestor"
          date="28 Dic 2023"
        />
      </div>
    </section>
  );
}
