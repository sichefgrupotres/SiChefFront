"use client";

import { useState } from "react";
import { userNavItems } from "@/utils/userNavitems";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatProvider";
import { useSession } from "next-auth/react";
import PremiumModal from "../PremiumModal";

interface Props {
    collapsed: boolean;
    setCollapsed: (value: boolean) => void;
}

export default function NavBarCreator({ collapsed, setCollapsed }: Props) {
    const pathname = usePathname();
    const router = useRouter(); // Usamos el router manual
    const { logout } = useAuth();
    const { totalUnread } = useChat();

    // Estado para el modal
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const { data: session } = useSession();

    // Verificación de permisos
    const user = session?.user as any;
    const isPremium = user?.role === "PREMIUM" || user?.isPremium;
    const isSpecialUser = user?.role === "admin" || user?.role === "creator" || user?.role === "CREATOR";
    const hasAccess = isPremium || isSpecialUser;

    // 👇 FUNCIÓN CLAVE: Controlamos el click manualmente
    const handleNavigation = (href: string) => {
        const isChat = href === "/chat";

        if (isChat && !hasAccess) {
            // 🛑 Si es chat y no tiene acceso: Abrimos modal y NO navegamos
            setShowPremiumModal(true);
        } else {
            // ✅ Si tiene acceso o es otra ruta: Navegamos
            router.push(href);
        }
    };

    return (
        <>
            <nav
                className={`
            fixed left-0 top-0 h-screen
            bg-[#2a221b] border-r border-white/10
            transition-all duration-300 z-40
            ${collapsed ? "w-20" : "w-64"}
        `}
            >
                {/* LOGO + TOGGLE */}
                <div className="flex items-center justify-between px-4 py-4">
                    {!collapsed && (
                        <span className="text-[#F57C00] font-bold">SI CHEF!</span>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="text-white/70 hover:text-white"
                    >
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>

                {/* NAV ITEMS */}
                <ul className="flex flex-col gap-2 px-3 text-sm">
                    {userNavItems.map((item) => {
                        const active = pathname === item.href;
                        const isChat = item.href === "/chat";

                        return (
                            <li key={item.href} className="relative">
                                {/* 👇 USAMOS UN DIV, NO UN LINK */}
                                <div
                                    onClick={() => handleNavigation(item.href)}
                                    className={`
                    flex items-center gap-3 px-3 py-3 rounded-lg transition cursor-pointer
                    ${active
                                            ? "bg-orange-500/20 text-orange-500"
                                            : "opacity-70 hover:bg-white/5"
                                        }
                  `}
                                >
                                    <span className="material-symbols-outlined text-lg">
                                        {item.icon}
                                    </span>
                                    {!collapsed && (
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{item.label}</span>
                                            {isChat && !hasAccess && (
                                                <span className="text-[10px] text-yellow-500">🔒</span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Badge de notificaciones */}
                                {isChat && totalUnread > 0 && (
                                    <div className={`
                      absolute top-2 bg-red-500 text-white text-[10px] font-bold 
                      min-w-[20px] h-5 px-1.5 rounded-full 
                      flex items-center justify-center 
                      animate-pulse shadow-lg pointer-events-none
                      ${collapsed ? "right-1" : "right-3"}
                  `}>
                                        {totalUnread > 9 ? "9+" : totalUnread}
                                    </div>
                                )}
                            </li>
                        );
                    })}

                    <li>
                        <button
                            onClick={logout}
                            className="
                w-full flex items-center gap-3 px-3 py-3 rounded-lg
                opacity-70 hover:bg-white/5 hover:opacity-100
                transition cursor-pointer hover:text-red-400"
                        >
                            <span className="material-symbols-outlined text-lg">logout</span>
                            {!collapsed && <span className="font-medium">Cerrar sesión</span>}
                        </button>
                    </li>
                </ul>
            </nav>

            {/* 👇 EL MODAL ESTÁ FUERA DEL NAV PARA EVITAR PROBLEMAS */}
            <PremiumModal
                isOpen={showPremiumModal}
                onClose={() => setShowPremiumModal(false)}
            />
        </>
    );
}
