"use client"
import { creatorNavItems } from '@/utils/creatorNavItems'
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CreatorNavbar() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#2A2622] border-t border-white/10">
            <ul className="flex justify-around py-3 text-sm">
                {creatorNavItems.map((item) => {
                    const active = pathname === item.href;

                    return (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={`flex flex-col items-center gap-1 ${active ? "text-orange-500" : "opacity-70"
                                    }`}
                            >
                                <span className="material-symbols-outlined">
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}