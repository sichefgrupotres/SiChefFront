"use client";

import { useState } from "react";
import { Crown, Check, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
type PlanConfig = {
  label: string;
  price: number;
  description: string;
  badge?: string; // 👈 opcional
};
type Plan = "monthly" | "yearly";

export default function SubscriptionPage() {
  const { data: session, status } = useSession();
  const [plan, setPlan] = useState<Plan>("monthly");
  const [loading, setLoading] = useState(false);

  const plans: Record<Plan, PlanConfig> = {
    monthly: {
      label: "Mensual",
      price: 9.99,
      description: "Pago mensual, cancela cuando quieras",
    },
    yearly: {
      label: "Anual",
      price: 99.99,
      description: "Ahorra 2 meses pagando anual",
      badge: "Más popular",
    },
  };

  const handleCheckout = async () => {
    if (status !== "authenticated") {
      Swal.fire({
        title: "Inicia sesión",
        text: "Debes iniciar sesión para suscribirte",
        icon: "warning",
        confirmButtonColor: "#F57C00",
      });
      return;
    }

    if (!session?.backendToken) {
      Swal.fire({
        title: "Error de sesión",
        text: "Vuelve a iniciar sesión",
        icon: "error",
        confirmButtonColor: "#F57C00",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/create-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.backendToken}`,
          },
          body: JSON.stringify({
            plan, // 👈 monthly | yearly
            successUrl: `${window.location.origin}/subscription/success`,
            cancelUrl: `${window.location.origin}/subscription/cancel`,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al crear la sesión");
      }

      window.location.href = data.url;
    } catch (error: any) {
      Swal.fire({
        title: "Ups…",
        text: error.message || "No se pudo iniciar el pago",
        icon: "error",
        confirmButtonColor: "#F57C00",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#181411] text-white px-4 py-16 flex justify-center">
      <div className="w-full max-w-4xl">
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center">
              <Crown className="text-orange-400" size={32} />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold">
            Accede a <span className="text-orange-400">Premium</span>
          </h1>
          <p className="text-white/70 mt-3 max-w-xl mx-auto">
            Desbloquea recetas exclusivas, preparaciones completas y contenido
            creado por chefs profesionales.
          </p>
        </div>

        {/* PLANES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(Object.keys(plans) as Plan[]).map((key) => {
            const p = plans[key];
            const active = plan === key;

            return (
              <button
                key={key}
                onClick={() => setPlan(key)}
                className={`
                  relative
                  rounded-2xl
                  border
                  p-6
                  text-left
                  transition-all
                  ${
                    active
                      ? "border-orange-500 bg-orange-500/10 shadow-lg"
                      : "border-white/10 bg-[#2a221b] hover:border-orange-500/40"
                  }
                `}
              >
                {p.badge && (
                  <span className="absolute top-4 right-4 text-xs font-bold bg-orange-500 text-white px-3 py-1 rounded-full">
                    {p.badge}
                  </span>
                )}

                <h3 className="text-xl font-bold">{p.label}</h3>
                <p className="text-white/60 mt-1">{p.description}</p>

                <div className="mt-6 text-4xl font-extrabold text-orange-400">
                  ${p.price}
                  <span className="text-base text-white/60 ml-1">
                    /{key === "monthly" ? "mes" : "año"}
                  </span>
                </div>

                <ul className="mt-6 space-y-3 text-sm">
                  <li className="flex gap-2">
                    <Check className="text-orange-400" size={16} />
                    Recetas premium exclusivas
                  </li>
                  <li className="flex gap-2">
                    <Check className="text-orange-400" size={16} />
                    Contenido sin bloqueos
                  </li>
                  <li className="flex gap-2">
                    <Check className="text-orange-400" size={16} />
                    Acceso completo a videos
                  </li>
                </ul>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <button
            disabled={loading}
            onClick={handleCheckout}
            className="
              flex
              items-center
              gap-3
              px-10
              py-4
              rounded-full
              bg-orange-500
              text-white
              font-bold
              text-lg
              hover:bg-orange-600
              transition
              shadow-xl
              disabled:opacity-70
            "
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Redirigiendo a Stripe…
              </>
            ) : (
              <>
                <Crown size={20} />
                Suscribirme ahora
              </>
            )}
          </button>
        </div>

        <p className="text-center text-xs text-white/50 mt-6">
          Cancela cuando quieras · Sin compromisos
        </p>
      </div>
    </div>
  );
}
