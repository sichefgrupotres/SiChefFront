"use client";

import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";

export default function SubscriptionCancelPage() {
    return (
        <div className="min-h-screen bg-[#181411] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-[#2a221b] border border-red-500/20 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">

                {/* Fondo decorativo */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -ml-10 -mb-10"></div>

                <div className="relative z-10 flex flex-col items-center">
                    {/* Icono */}
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                        <XCircle className="text-red-500 w-10 h-10" />
                    </div>

                    <h1 className="text-2xl font-bold text-white mb-2">
                        No se completó el pago
                    </h1>

                    <p className="text-gray-400 mb-8 text-sm">
                        El proceso de suscripción fue cancelado o hubo un problema con el método de pago. No se te ha cobrado nada.
                    </p>

                    <div className="flex flex-col gap-3 w-full">
                        {/* Botón Reintentar (Vuelve a la pantalla de precios) */}
                        <Link
                            href="/subscription"
                            className="w-full py-3.5 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Intentar nuevamente
                        </Link>

                        {/* Botón Volver al inicio */}
                        <Link
                            href="/user"
                            className="w-full py-3.5 bg-transparent border border-white/10 text-white/60 font-semibold rounded-xl hover:bg-white/5 hover:text-white transition-colors flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}