

import RegisterForm from "@/components/auth/RegisterForm";
import { requireGuest } from "@/lib/requireGuest";

export default async function RegisterPage() {
  // ❌ Si hay sesión activa → redirige
  await requireGuest();

  // ✅ Si NO hay sesión → muestra register
  return <RegisterForm />;
}