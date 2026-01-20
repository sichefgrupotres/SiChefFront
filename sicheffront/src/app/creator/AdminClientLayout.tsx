"use client";

import { useState } from "react";
import NavBarCreator from "../../components/NavBars/NavBarCreator";


export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#181411] text-white">

      <main className={`p-4 pb-28 transition-all duration-300  ${collapsed ? "ml-20" : "ml-64"}`}>
        <NavBarCreator
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
        {children}
      </main>

    </div>
  );
}
