import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { roleRedirect } from "./roleRedirect";

export async function requireGuest() {
  const session = await getServerSession(authOptions);

  // ✅ Si ya hay sesión → fuera
  if (session) {
    const role = session.user.role;
    redirect(roleRedirect[role] ?? "/");
  }
}