"use client";
import { creatorNavItems } from "@/utils/creatorNavItems";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Props {
    collapsed: boolean;
    setCollapsed: (value: boolean) => void;
}

export default function NavBarCreator({
    collapsed,
    setCollapsed,
}: Props) {
    const pathname = usePathname();
    const routes = useRouter();
    const { logout } = useAuth();
    const handleLogout = () => {
    // 1️⃣ Limpiar estado del contexto
    logout();

    // 2️⃣ Limpiar localStorage (tokens o datos de sesión)
    localStorage.clear();

    // 3️⃣ Redirigir al login
    routes.push("/login");
  };

    return (
        <nav
            className={`
                fixed left-0 top-0 h-screen
                bg-[#2a221b] border-r border-white/10
                transition-all duration-300
                ${collapsed ? "w-20" : "w-64"}
            `}
        >
            {/* LOGO + TOGGLE */}
            <div className="flex items-center justify-between px-4 py-4">
                {!collapsed && (
                    <span className="text-[#F57C00] font-bold">
                        SI CHEF!
                    </span>
                )}

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="text-white/70 hover:text-white"
                >
                    <span className="material-symbols-outlined">
                        menu
                    </span>
                </button>
            </div>

            {/* NAV ITEMS */}
            <ul className="flex flex-col gap-2 px-3 text-sm">
                {creatorNavItems.map((item) => {
                    const active = pathname === item.href;

                    return (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={`
                                    flex items-center gap-3 px-3 py-3 rounded-lg transition
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
                                    <span className="font-medium">
                                        {item.label}
                                    </span>
                                )}
                            </Link>
                        </li>
                    );
                })}
                <li>
                    <button
                        onClick={handleLogout}
                        className="
                            w-full flex items-center gap-3 px-3 py-3 rounded-lg
                            opacity-70 hover:bg-white/5 hover:opacity-100
                            transition cursor-pointer hover:text-red-400
                            "
                    >
                        <span className="material-symbols-outlined text-lg">
                            logout
                        </span>

                        {!collapsed && (
                            <span className="font-medium">
                                Logout
                            </span>
                        )}
                    </button>
                </li>

            </ul>
        </nav>
    );
}
