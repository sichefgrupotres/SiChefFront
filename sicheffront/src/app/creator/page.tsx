import { PATHROUTES } from "@/utils/PathRoutes";
import Link from "next/link";

export default function CreatorPage() {
  return (
    <div className="flex flex-col gap-8 p-4 pb-28 bg-[#181411] min-h-screen px-4 sm:px-8 lg:px-16">

      <header className="sticky top-0 z-40 bg-[#181411] border-b border-[#e6e0db] dark:border-[#393028] px-0 py-2 flex items-center justify-end transition-colors duration-300">

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">
            Chef Marco
          </span>

          <img
            src="/chef-avatar.jpg"
            alt="User avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>

      </header>


      {/* OVERVIEW */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Descripción general</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-[#2a221b] rounded-xl p-4 min-h-24 sm:min-h-28">
            <p className="text-sm text-white/60">Vistas</p>
            <p className="text-xl font-semibold">12.5k</p>
          </div>

          <div className="bg-[#2a221b] rounded-xl p-4 min-h-24 sm:min-h-28">
            <p className="text-sm text-white/60">Seguidores</p>
            <p className="text-xl font-semibold">850</p>
          </div>

          <div className="bg-[#2a221b] rounded-xl p-4 min-h-24 sm:min-h-28">
            <p className="text-sm text-white/60">Calificación</p>
            <p className="text-xl font-semibold">4.8</p>
          </div>
        </div>
      </section>

      {/* HEADER ACTIONS */}
      <section className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mt-4">
        <Link
          href={PATHROUTES.NEWRECIPE}
          className="w-full sm:w-48 py-3 rounded-lg bg-orange-500/20 text-[#F57C00] font-semibold
                   flex items-center justify-center gap-2
                   hover:bg-[#F57C00] hover:text-white transition-all active:scale-95 
                   ">
          <span className="material-symbols-outlined text-[26px]">
            restaurant_menu
          </span>
          <span>Nueva Receta</span>
        </Link>

        <button
          className="w-full sm:w-48 py-3 rounded-lg bg-orange-500/20 text-[#F57C00] font-semibold
                   flex items-center justify-center gap-2
                   hover:bg-[#F57C00] hover:text-white transition-all active:scale-95 
                   cursor-pointer"
        >
          <span className="material-symbols-outlined text-[26px]">
            video_camera_front
          </span>
          <span>Nuevo tutorial</span>
        </button>
      </section>

      {/* PERFORMANCE */}
      <section className="bg-[#2a221b] rounded-xl p-4">
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
          <div className="bg-[#2a221b] rounded-xl p-3 flex justify-between items-center">
            <div>
              <p className="font-medium">Ensalada de quinoa de verano</p>
              <p className="text-sm text-white/50">Editado hace 2h</p>
            </div>
            <button>✏️</button>
          </div>

          <div className="bg-[#2a221b] rounded-xl p-3 flex justify-between items-center">
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
