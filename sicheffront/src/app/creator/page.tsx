"use client";

import { PATHROUTES } from "@/utils/PathRoutes";
import Image from "next/image";
import Link from "next/link";

export default function GuestHomePage() {
  return (
    <div>
      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto">
        {/* ================= HERO TOP ================= */}
        <section className="px-4 md:px-8 py-16 flex flex-col items-center gap-8 text-center">
          <div className="flex items-center gap-4">
            <Image
              src="/Logo.png"
              alt="Logo Si Chef"
              width={150}
              height={150}
              className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover"
            />

            <h1 className="text-[#F57C00] text-4xl md:text-6xl font-bold">
              Si Chef!
            </h1>
          </div>

          {/* Buscador */}
          <div className="flex w-full max-w-2xl">
            <div className="flex items-center gap-2 w-full border border-gray-300 rounded-l-xl px-4 py-3 bg-white">
              <span className="material-symbols-outlined text-gray-400">
                search
              </span>
              <input
                type="text"
                placeholder="Busca por receta o ingredientes"
                className="w-full outline-none text-sm text-black"
              />
            </div>

            <button className="bg-orange-500 text-white px-8 rounded-r-xl text-sm font-semibold">
              Buscar
            </button>
          </div>
        </section>

        {/* ================= HERO IMAGE ================= */}
        <section className="px-4 md:px-8 pb-12">
          <div className="relative overflow-hidden rounded-2xl bg-surface-dark min-h-[480px]">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7LBKM97Hw5BXXGD8gI11cVkTG7xDfs2TGaqn8td8kqqfQm3OuNbStLJBUbaImwCcWtAyp-pElKomgPFLajP3LH1XdJhPIaynka_BJ6Yg4NHZ6rybPdbbp7TqdO86RwYJ4MIOkw99xeTGSFHmC5TQ08cm2ZY10V5swnX-iBM2br7s54n2Ch5zsAYpPxFIsIfPrjgKnJvV8P5busW2i3JGpWHF8a4ccfxHtmtRZhzPCJWSAljDFRKfPVYpuFaU6jT08R0ApUQqobtY"
              alt="Hero"
              fill
              className="object-cover opacity-60"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />

            <div className="relative z-10 p-6 md:p-16 flex flex-col justify-end min-h-120">
              <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">
                Premium
              </span>

              <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
                Domina el Arte del{" "}
                <span className="text-primary">Risotto Perfecto</span>
              </h1>

              <p className="text-gray-300 max-w-xl mb-8">
                Accedé a tutoriales exclusivos paso a paso con chefs
                profesionales.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-primary text-white font-bold px-8 py-4 rounded-xl">
                  Ver Tutorial Premium
                </button>
                <button className="bg-white/10 text-white px-8 py-4 rounded-xl">
                  Explorar cursos
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CATEGORIES ================= */}
        <section className="px-4 md:px-8 pb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Categorías Populares
          </h2>
          <div className="flex gap-4 overflow-x-auto">
            {["Desayunos", "Almuerzos", "Meriendas", "Cenas", "Postres"].map(
              (cat) => (
                <div
                  key={cat}
                  className="min-w-35 h-24 bg-black/40 rounded-xl flex items-center justify-center text-white font-bold"
                >
                  {cat}
                </div>
              )
            )}
          </div>
        </section>

        {/* ================= RECIPES GRID ================= */}
        <section className="px-4 md:px-8 pb-16">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Tendencias de la semana
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow hover:shadow-xl transition"
              >
                <div className="relative h-40">
                  <Image
                    src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
                    alt="recipe"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-bold">Receta ejemplo</h3>
                  <p className="text-sm text-gray-500">
                    Descripción corta de la receta.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className=" border-gray-200 dark:border-white/10 py-10 text-center text-sm text-gray-500">
        © 2025 SiChef! · Todos los derechos reservados
      </footer>
    </div>
  );
}
