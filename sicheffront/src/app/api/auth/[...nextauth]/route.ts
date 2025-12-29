import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET as string,
    }),
  ],
   callbacks: {
    async jwt({ token, user, account }: any) {
      // Cuando el usuario inicia sesión con Google
      if (account && user) {
        try {
          // LLAMADA A TU BACKEND NESTJS
          const response = await fetch(`${process.env.NEXTAUTH_URL}/auth/register-google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              googleId: user.id,
              email: user.email,
              name: user.name.split(' ')[0], // Ajusta según tu DTO
              lastname: user.name.split(' ').slice(1).join(' '),
              roleId: token.roleId
            }),
          });

          const userData = await response.json();
          
          // Inyectamos el ROL que viene de tu DB de NestJS en el token de NextAuth
          token.roleId = userData.user.roleId; 
          token.backendToken = userData.token; // Si tu back devuelve un JWT
        } catch (error) {
          console.error("Error vinculando con el backend:", error);
        }
      }
      return token;
    },
     async session({ session, token }) {
      
    if (session.user) {
      (session.user as any).id = token.sub; // Mapea el ID de Google a la sesión
    }
    return session;
  },
  },
  session: { strategy: "jwt" },
});

export const GET = authOptions.handlers.GET;
export const POST = authOptions.handlers.POST;