"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CloseModalButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      aria-label="Cerrar"
      className="
  absolute top-4 right-4 z-50
  flex items-center justify-center
  h-10 w-10
  rounded-full
  bg-black/60 backdrop-blur-sm
  text-white
  shadow-lg
  transition
  duration-150
  ease-out
  hover:bg-black/80
  hover:scale-105
  hover:shadow-xl
  cursor-pointer
"
    >
      <X className="h-5 w-5 cursor-pointer" />
    </button>
  );
}
