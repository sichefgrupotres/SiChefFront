"use client";

import Link from "next/link";
import { Play, Trash2 } from "lucide-react";
import { TutorialInterface } from "@/interfaces/ITutorial";

interface TutorialCardProps {
  tutorial: TutorialInterface;
  mode?: "creator" | "guest" | "admin" | "user";
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const TutorialCard = ({
  tutorial,
  mode = "creator",
  onEdit,
  onDelete,
}: TutorialCardProps) => {
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
      <div className="relative flex flex-col w-full rounded-xl overflow-hidden bg-[#2a221b] shadow hover:shadow-xl transition">
        {/* BOTONES */}
        {(mode === "creator" || mode === "admin") && (
          <div className="absolute top-2 right-2 z-10 flex gap-2 bg-black/40 p-1.5 rounded-lg">
            {/* <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit?.(tutorial.id);
              }}
              className="px-2 py-1 text-xs rounded bg-blue-600 hover:bg-blue-700 text-white">
              Editar
            </button> */}

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete?.(tutorial.id);
              }}
              className="text-white hover:text-red-400 transition"
              title="Eliminar receta">
              <Trash2 size={18} />
            </button>
          </div>
        )}

        {/* THUMBNAIL */}
        <div className="relative w-full overflow-hidden aspect-16/10 sm:aspect-video">
          <img
            src={tutorial.thumbnailUrl}
            alt={tutorial.title}
            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition" />

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-black/70 backdrop-blur shadow-xl">
              <Play className="text-white w-8 h-8 ml-1" fill="white" />
            </div>
          </div>
        </div>

        {/* INFO */}
        <div className="absolute bottom-0 left-0 w-full px-4 py-3 bg-linear-to-t from-black/80 via-black/40 to-transparent">
          <p className="text-white font-semibold text-base truncate tracking-wide drop-shadow">
            {tutorial.title}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default TutorialCard;
