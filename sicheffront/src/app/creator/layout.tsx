import AdminClientLayout from "./AdminClientLayout";
import { requireRole } from "@/lib/requireRole";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["CREATOR", "ADMIN"]);

  return <AdminClientLayout>{children}</AdminClientLayout>;
}