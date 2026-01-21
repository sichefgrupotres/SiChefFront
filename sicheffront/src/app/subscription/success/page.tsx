"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import Link from "next/link";
import { CheckCircle, Crown, ArrowRight, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();

  const [isVerifying, setIsVerifying] = useState(true);

  const triggerConfettiSafe = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#F57C00', '#ffffff']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#F57C00', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.backendToken) {
      router.replace("/");
      return;
    }

    const verifySubscription = async () => {
      try {
        // 👇👇 AQUÍ ESTÁ EL CAMBIO IMPORTANTE: POLLING 👇👇
        let attempts = 0;
        let isActive = false;
        const maxAttempts = 10; // Intentaremos durante 10 segundos aprox

        while (attempts < maxAttempts && !isActive) {
          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/active`,
              {
                headers: {
                  Authorization: `Bearer ${session.backendToken}`,
                },
              }
            );

            // Si devuelve 200 OK, rompemos el bucle
            if (res.ok) {
              isActive = true;
            } else {
              // Si no, esperamos 1 segundo y seguimos
              throw new Error("No activo");
            }
          } catch (e) {
            // Esperar 1 segundo antes del siguiente intento
            await new Promise((resolve) => setTimeout(resolve, 1000));
            attempts++;
          }
        }
        // 👆👆 FIN DEL POLLING 👆👆

        if (isActive) {
          // ÉXITO REAL
          await update(); // Actualizamos sesión
          setIsVerifying(false);
          triggerConfettiSafe();
        } else {
          // SI DESPUÉS DE 10 INTENTOS SIGUE SIN ACTIVARSE
          throw new Error("Timeout: El pago tardó demasiado en impactar");
        }

      } catch (error) {
        console.log("Error o timeout en verificación:", error);

        // Fallback: Le decimos que espere un poco más
        Swal.fire({
          title: "Procesando pago...",
          text: "Estamos confirmando tu suscripción con el banco. Esto puede tardar unos segundos más. Revisa tu perfil en un momento.",
          icon: "info",
          confirmButtonColor: "#F57C00",
          background: "#2a221b",
          color: "#fff"
        }).then(() => {
          router.replace("/user/profile"); // O donde prefieras
        });
      }
    };

    if (isVerifying) {
      verifySubscription();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, router, update]);


  // ... (TUS RENDERS DE ABAJO ESTÁN PERFECTOS, NO HACE FALTA CAMBIARLOS) ...
  // Solo copio la parte lógica que es lo crítico.

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#181411] flex flex-col items-center justify-center text-orange-400 gap-6">
        <div className="relative">
          <span className="text-6xl animate-pulse">👑</span>
          <div className="absolute -inset-4 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-white">Verificando pago...</h2>
          <p className="text-sm text-white/60">Estamos confirmando con el banco, por favor espera...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#181411] flex items-center justify-center px-4 animate-fade-in">
      <div className="max-w-md w-full bg-[#2a221b] border border-[#F57C00]/30 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">

        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F57C00]/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#F57C00]/10 rounded-full blur-3xl -ml-10 -mb-10"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
            <CheckCircle className="text-green-500 w-10 h-10" />
          </div>

          <h1 className="text-3xl font-extrabold text-white mb-2">
            ¡Ya eres <span className="text-[#F57C00]">Premium!</span>
          </h1>

          <p className="text-gray-400 mb-8">
            Tu suscripción se activó correctamente.
          </p>

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
            href="/user" // Asegúrate que esta ruta exista
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