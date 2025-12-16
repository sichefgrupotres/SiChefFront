import { PATHROUTES } from "@/utils/PathRoutes";
import Link from "next/link";

export default function CreatorPage() {
  return (
    <div className="flex flex-col gap-8 p-4 pb-28 bg-[#3D2B1F] min-h-screen px-4 sm:px-8 lg:px-16">

      {/* OVERVIEW */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Descripción general</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-[#543C2A] rounded-xl p-4 min-h-24 sm:min-h-28">
            <p className="text-sm text-white/60">Vistas</p>
            <p className="text-xl font-semibold">12.5k</p>
          </div>

          <div className="bg-[#543C2A] rounded-xl p-4 min-h-24 sm:min-h-28">
            <p className="text-sm text-white/60">Seguidores</p>
            <p className="text-xl font-semibold">850</p>
          </div>

          <div className="bg-[#543C2A] rounded-xl p-4 min-h-24 sm:min-h-28">
            <p className="text-sm text-white/60">Calificación</p>
            <p className="text-xl font-semibold">4.8</p>
          </div>
        </div>
      </section>

      {/* HEADER ACTIONS */}
      <section className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mt-4">
        <Link
          href={PATHROUTES.NEWREPICE}
          className="w-full sm:w-48 py-3 rounded-lg bg-[#F57C00] text-white font-semibold
                   flex items-center justify-center gap-2
                   hover:bg-orange-600 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[26px]">
            restaurant_menu
          </span>
          <span>Nueva Receta</span>
        </Link>

        <button
          className="w-full sm:w-48 py-3 rounded-lg bg-[#F57C00] text-white font-semibold
                   flex items-center justify-center gap-2
                   hover:bg-orange-600 transition-all active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[26px]">
            video_camera_front
          </span>
          <span>Nuevo tutorial</span>
        </button>
      </section>

      {/* PERFORMANCE */}
      <section className="bg-[#543C2A] rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Actuación (30 días)</h3>
          <span className="text-green-400 text-sm">+12%</span>
        </div>

        <div className="h-32 sm:h-40 bg-[#1E1B18] rounded-lg flex items-center justify-center text-white/40">
          Marcador de posición del gráfico
        </div>
      </section>

      {/* RECENT DRAFTS */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Borradores recientes</h3>
          <button className="text-orange-500 text-sm">Administrar</button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="bg-[#543C2A] rounded-xl p-3 flex justify-between items-center">
            <div>
              <p className="font-medium">Ensalada de quinoa de verano</p>
              <p className="text-sm text-white/50">Editado hace 2h</p>
            </div>
            <button>✏️</button>
          </div>

          <div className="bg-[#543C2A] rounded-xl p-3 flex justify-between items-center">
            <div>
              <p className="font-medium">Tutorial básico de masa madre</p>
              <p className="text-sm text-white/50">Editado ayer</p>
            </div>
            <button>✏️</button>
          </div>
        </div>
      </section>
    </div>
  );
}
