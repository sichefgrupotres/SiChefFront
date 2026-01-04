"use client";
import { useSyncGoogleSession } from "@/hooks/useSyncGoogleSession";

export function AuthBootstrap() {
  useSyncGoogleSession();
  return null;
}
