"use client";

import { useState } from "react";
import NavBarGuest from "../../components/NavBars/NavBarGuest";

export default function GuestLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-[#181411] text-white">

            {/* <NavBarGuest
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            /> */}

            <main
            //     className={`
            //         p-4 pb-28 transition-all duration-300
            //         ${collapsed ? "ml-20" : "ml-64"}
            //     `}
            >
                {children}
            </main>

        </div>
    );
}
