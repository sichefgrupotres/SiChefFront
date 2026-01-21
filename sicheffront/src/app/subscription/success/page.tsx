"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import Link from "next/link";
import { CheckCircle, Crown, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();

  // Estado para controlar qué pantalla mostramos
  const [isVerifying, setIsVerifying] = useState(true);

  // Función SEGURA para el confeti (Disparo único, sin bucles)
  const triggerConfettiSafe = () => {
    // Disparo desde la izquierda
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6, x: 0.1 }, // Un poco abajo y a la izquierda
      zIndex: 9999,
    });
    // Disparo desde la derecha
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6, x: 0.9 }, // Un poco abajo y a la derecha
        zIndex: 9999,
      });
    }, 200); // Un pequeño retraso para el segundo disparo
  };

  useEffect(() => {
    // 1. Esperamos a que la sesión cargue
    if (status === "loading") return;

    if (!session?.backendToken) {
      router.replace("/");
      return;
    }

    const verifySubscription = async () => {
      try {
        // 2. Preguntamos al Backend si ya impactó el pago
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/active`,
          {
            headers: {
              Authorization: `Bearer ${session.backendToken}`,
            },
          }
        );

        if (res.status === 404) throw new Error("No activa aún");

        // Si el endpoint devuelve OK (200), el pago impactó.

        // 3. ¡ÉXITO! Actualizamos la sesión local
        await update();

        // 4. Cambiamos la pantalla y lanzamos el confeti SOLO UNA VEZ
        setIsVerifying(false);
        triggerConfettiSafe();

      } catch (error) {
        console.log("Pago en proceso o webhook demorado...", error);

        // 5. FALLBACK: Si el webhook tarda
        Swal.fire({
          title: "Procesando suscripción…",
          text: "Tu pago fue recibido. En unos segundos tendrás acceso total.",
          icon: "info",
          confirmButtonColor: "#F57C00",
          background: "#2a221b",
          color: "#fff"
        });

        // Redirigimos al perfil para que espere allí
        setTimeout(() => {
          router.replace("/user/premium/profile");
        }, 3000);
      }
    };

    // Solo ejecutamos si estamos verificando
    if (isVerifying) {
      verifySubscription();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, router, update]); // Quitamos isVerifying de las dependencias para evitar bucles


  // ==========================================
  // RENDER 1: PANTALLA DE CARGA (TU DISEÑO)
  // ==========================================
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#181411] flex flex-col items-center justify-center text-orange-400 gap-6">
        <div className="relative">
          <span className="text-6xl animate-pulse">👑</span>
          {/* Pequeño spinner alrededor para dar sensación de proceso técnico */}
          <div className="absolute -inset-4 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-white">Verificando pago...</h2>
          <p className="text-sm text-white/60">Activando tus beneficios premium</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER 2: PANTALLA DE ÉXITO (MI DISEÑO)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#181411] flex items-center justify-center px-4 animate-fade-in">
      <div className="max-w-md w-full bg-[#2a221b] border border-[#F57C00]/30 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">

        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F57C00]/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#F57C00]/10 rounded-full blur-3xl -ml-10 -mb-10"></div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Icono Animado */}
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
            <CheckCircle className="text-green-500 w-10 h-10" />
          </div>

          <h1 className="text-3xl font-extrabold text-white mb-2">
            ¡Ya eres <span className="text-[#F57C00]">Premium!</span>
          </h1>

          <p className="text-gray-400 mb-8">
            Tu suscripción se activó correctamente. Ahora tienes acceso ilimitado a todas las recetas y funciones exclusivas.
          </p>

          {/* Badge informativo */}
          <div className="w-full bg-black/20 rounded-xl p-4 mb-8 border border-white/5">
            <div className="flex items-center gap-3 text-left">
              <div className="bg-[#F57C00] p-2 rounded-lg">
                <Crown className="text-white w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Membresía Activada</p>
                <p className="text-xs text-gray-500">Gracias por unirte a SiChef!</p>
              </div>
            </div>
          </div>

          <Link
            href="/user"
            className="w-full py-4 bg-[#F57C00] hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 group"
          >
            Ir al Inicio
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}