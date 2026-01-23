"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X, Crown } from "lucide-react";
import { useRouter } from "next/navigation";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    if (isOpen) {
      // Bloqueamos el scroll de la página de fondo
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  // Renderizamos en el body usando Portal
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* 1. FONDO: Oscuro con desenfoque (backdrop-blur) */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-all"
        onClick={onClose} // Cierra si tocas el fondo
      />

      {/* 2. CONTENIDO DEL MODAL */}
      <div className="relative w-full max-w-sm bg-[#2a221b] border border-[#F57C00] rounded-2xl p-6 shadow-2xl text-center z-10 animate-fade-in">
        {/* Botón Cerrar (X) - Ejecuta onClose directamente */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Evita que el click pase al fondo
            router.back();
            onClose();
          }}
          className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 cursor-pointer">
          <X size={20} />
        </button>

        {/* Icono */}
        <div className="mx-auto w-16 h-16 bg-[#F57C00]/20 rounded-full flex items-center justify-center mb-4 border border-[#F57C00]/30 shadow-lg shadow-orange-500/10">
          <Crown className="text-[#F57C00]" size={32} />
        </div>

        <h2 className="text-xl font-bold text-white mb-2">Contenido Premium</h2>

        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          Esta receta es exclusiva para suscriptores. Pásate a Premium para
          desbloquearla y guardarla en favoritos.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/subscription"
            className="w-full py-3.5 bg-[#F57C00] hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95">
            Ver Planes
          </Link>

          {/* Botón Quizás más tarde - Ejecuta onClose directamente */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.back();
              onClose();
            }}
            className="text-sm text-gray-500 hover:text-white transition-colors py-2 cursor-pointer">
            Quizás más tarde
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
