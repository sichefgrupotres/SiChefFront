"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { Crown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PremiumProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session?.user) {
    router.replace("/login");
    return null;
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-[#181411] text-white flex justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
        {/* CARD PERFIL */}
        <div className="relative bg-[#2a221b] rounded-3xl border border-orange-500/40 shadow-xl p-8 overflow-hidden">
          {/* Glow Premium */}
          <div className="absolute -top-24 -right-24 w-56 h-56 bg-orange-500/20 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* AVATAR */}
            <div className="relative">
              {/* Ring Premium */}
              <div className="absolute inset-0 rounded-full ring-4 ring-orange-500/80 animate-pulse" />

              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#2a221b]">
                <Image
                  src={user.avatarUrl || "/avatar-default.png"}
                  alt="Avatar"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Badge Premium */}
              <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
                <Crown size={20} />
              </div>
            </div>

            {/* INFO */}
            <h1 className="mt-6 text-2xl font-extrabold">
              {user.name} {user.lastname}
            </h1>

            <p className="text-orange-400 font-semibold text-sm mt-1">
              Usuario Premium
            </p>

            <p className="text-white/60 text-sm mt-2">{user.email}</p>

            {/* DIVIDER */}
            <div className="w-full h-px bg-white/10 my-8" />

            {/* BENEFICIOS */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="bg-[#181411] rounded-xl p-4 border border-white/10">
                <h3 className="font-semibold text-orange-400">
                  Acceso completo
                </h3>
                <p className="text-sm text-white/60 mt-1">
                  Todas las recetas y videos desbloqueados
                </p>
              </div>

              <div className="bg-[#181411] rounded-xl p-4 border border-white/10">
                <h3 className="font-semibold text-orange-400">
                  Contenido exclusivo
                </h3>
                <p className="text-sm text-white/60 mt-1">
                  Preparaciones creadas por chefs profesionales
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <p className="text-center text-xs text-white/40 mt-6">
          Gracias por apoyar SiChef! 👑
        </p>
      </div>
    </div>
  );
}
