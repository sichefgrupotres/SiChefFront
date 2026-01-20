"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { TutorialInterface } from "@/interfaces/ITutorial";

interface TutorialCardProps {
  tutorial: TutorialInterface;
  mode?: "creator" | "guest" | "admin" | "user";
}

const TutorialCard = ({ tutorial, mode = "creator" }: TutorialCardProps) => {
  const href =
    mode === "creator"
      ? `/creator/tutorials/${tutorial.id}`
      : mode === "admin"
      ? `/admin/content/${tutorial.id}`
      : mode === "user"
      ? `/user/tutorials/${tutorial.id}`
      : `/guest/tutorials/${tutorial.id}`;

  return (
    <Link href={href} scroll={false} className="block group">
      <div className="relative flex flex-col w-full rounded-xl overflow-hidden bg-[#2a221b] shadow hover:shadow-xl transition "> 
        {/* THUMBNAIL */}
        <div className="relative w-full overflow-hidden aspect-16/10 sm:aspect-video">
          <img
            src={tutorial.thumbnailUrl}
            alt={tutorial.title}
            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition" />

          {/* PLAY */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-black/70 backdrop-blur shadow-xl">
              <Play className="text-white w-8 h-8 ml-1" fill="white" />
            </div>
          </div>
        </div>

        {/* INFO */}
        <div className="absolute bottom-0 left-0 w-full px-4 py-3 bg-linear-to-t from-black/80 via-black/40 to-transparent">
          <p className="text-white font-semibold text-base truncate tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
            {tutorial.title}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default TutorialCard;