"use client"
import { creatorNavItems } from '@/utils/creatorNavItems'
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CreatorNavbar() {
    const pathname = usePathname();

    return (
        <nav className="w-64 min-h-screen bg-[#3D2B1F] border-r border-white/10">
            <ul className="flex flex-col gap-2 p-4 text-sm">
                {creatorNavItems.map((item) => {
                    const active = pathname === item.href;

                    return (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
                                    ${active
                                        ? "bg-orange-500/20 text-orange-500"
                                        : "opacity-70 hover:bg-white/5"
                                    }`}
                            >
                                <span className="material-symbols-outlined text-lg">
                                    {item.icon}
                                </span>
                                <span className="font-medium">
                                    {item.label}
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
