"use client";

import ModerationList from "@/components/admin/moderation/ModeationList";
import ModerationTabs from "@/components/admin/moderation/ModerationTabs";
import { useState } from "react";

export default function ContentPage() {
  const [tab, setTab] = useState<"pending" | "reported">("pending");

  return (
    <div
      className="
        flex flex-col gap-8
        p-4 pb-28
        bg-[#181411] min-h-screen
        px-4 sm:px-8 lg:px-16
      "
    >
      {/* HEADER */}
      <header>
        <h1 className="text-2xl font-bold text-white border-l-4 border-orange-500 pl-3">
          Moderación
        </h1>
      </header>

      <ModerationTabs tab={tab} setTab={setTab} />
      <ModerationList tab={tab} />
    </div>
  );
}

