import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { roleRedirect } from "./roleRedirect";


export async function requireRole(
  allowedRoles: string[]
) {
  const session = await getServerSession(authOptions);
  

  if (!session) {
    redirect("/login");
  }

  if (!allowedRoles.includes(session.user.role)) {
    redirect(roleRedirect[session.user.role] ?? "/");
  }

  return session;
}