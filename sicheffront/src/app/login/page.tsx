

import LoginForm from "@/components/auth/LoginForm";
import { requireGuest } from "@/lib/requireGuest";

export default async function LoginPage() {
  // ❌ Si hay sesión activa → redirige
  await requireGuest();

  // ✅ Si NO hay sesión → muestra login
  return <LoginForm />;
}