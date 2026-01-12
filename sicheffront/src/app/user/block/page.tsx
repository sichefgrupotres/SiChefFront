import { Lock, Check } from "lucide-react";
import Image from "next/image";

const PremiumModal = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-[#181411] rounded-2xl shadow-2xl overflow-hidden border-t-8 border-[#F57C00]">

                {/* Botón cerrar */}
                <button className="absolute top-4 right-4 text-white hover:text-red-500 transition cursor-pointer">
                    ✕
                </button>

                <div className="p-8 text-center">

                    <div className="mx-auto w-24 h-24 rounded-full bg-[#F1E8DE] flex items-center justify-center mb-6 relative overflow-hidden  ring-3 ring-[#F57C00]">
                        <Image
                            src="/logo.png"
                            alt="Si Chef Logo"
                            fill
                            className="object-contain"
                        />
                    </div>


                    {/* Texto */}
                    <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
                        CONTENIDO PREMIUM
                    </h2>

                    <p className="text-white mb-8">
                        Esta función está disponible solo para miembros{" "}
                        <span className="font-bold text-[#F57C00] underline">
                            Premium
                        </span>

                    </p>

                    {/* Beneficios */}
                    <ul className="text-left space-y-4 mb-8 inline-block">
                        <li className="flex items-center text-white">
                            <Check className="w-5 h-5 text-[#F57C00] mr-3" />
                            <span>Chat directo con chefs profesionales.</span>
                        </li>

                        <li className="flex items-center text-white">
                            <Check className="w-5 h-5 text-[#F57C00] mr-3" />
                            <span>Recetas premium solo para suscriptores.</span>
                        </li>

                        <li className="flex items-center text-white">
                            <Check className="w-5 h-5 text-[#F57C00] mr-3" />
                            <span>Videos tutoriales exclusivos.</span>
                        </li>
                    </ul>

                    {/* Acciones */}
                    <div className="space-y-4">
                        <button className="w-full bg-[#F57C00] hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg transition transform hover:scale-[1.02] active:scale-95 cursor-pointer">
                            HACERME PREMIUM
                        </button>

                        <button className="text-white text-sm font-medium hover:text-white/50 transition cursor-pointer underline">
                            Tal vez más tarde
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremiumModal;
