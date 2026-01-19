import AdminClientLayout from "./AdminClientLayout";
import { requireRole } from "@/lib/requireRole";

export default async function AdminLayout({
  children,
   modal
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  await requireRole(["CREATOR", "ADMIN"]);

  return (
  <AdminClientLayout>
    {children}
    {modal} 
  </AdminClientLayout>
);  
}