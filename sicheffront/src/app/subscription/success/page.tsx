"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.backendToken) {
      router.replace("/");
      return;
    }

    const checkSubscription = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/active`,
          {
            headers: {
              Authorization: `Bearer ${session.backendToken}`,
            },
          }
        );

        if (res.status === 404) {
          throw new Error("Suscripción no activa");
        }

        const subscription = await res.json();

        if (
          subscription.status === "active" ||
          subscription.status === "trialing"
        ) {
          // 🎉 Usuario premium
          Swal.fire({
            title: "¡Bienvenido a Premium! 👑",
            text: "Tu suscripción fue activada correctamente.",
            icon: "success",
            confirmButtonColor: "#F57C00",
          }).then(() => {
            router.replace("/premium");
          });
        } else {
          throw new Error("Estado no válido");
        }
      } catch (error) {
        Swal.fire({
          title: "Procesando suscripción…",
          text: "Tu pago fue recibido. En unos segundos tendrás acceso.",
          icon: "info",
          confirmButtonColor: "#F57C00",
        });

        setTimeout(() => {
          router.replace("/user/premium/profile");
        }, 3000);
      }
    };

    checkSubscription();
  }, [session, status, router]);

  return (
    <div className="min-h-screen bg-[#181411] flex flex-col items-center justify-center text-orange-400 gap-4">
      <span className="text-6xl animate-pulse">👑</span>
      <p className="text-sm text-white/70">
        Activando tu suscripción premium…
      </p>
    </div>
  );
}