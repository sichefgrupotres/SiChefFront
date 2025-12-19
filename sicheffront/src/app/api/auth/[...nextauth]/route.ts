// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth"  // apunta a auth.ts

export const { GET, POST } = handlers
