import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/signin`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          },
        );

        const data = await res.json();
        if (res.status === 403 && data?.error === "USER_BLOCKED") {
          // Esto llegará al frontend como result.error
          return Promise.reject(new Error("USER_BLOCKED"));
        }
        if (!res.ok) return null;

        if (!data?.token || !data?.user?.id) return null;

        // Retornamos el objeto completo incluyendo isPremium
        return {
          id: data.user.id,
          name: data.user.name,
          lastname: data.user.lastname,
          email: data.user.email,
          role: data.user.role,
          avatarUrl: data.user.avatarUrl,
          isPremium: data.user.isPremium, // 👈 CAPTURAMOS DEL BACK
          token: data.token,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, account, profile, trigger, session }) {
      // 1. Login Inicial (Credenciales)
      if (user) {
        token.id = (user as any).id;
        token.name = user.name;
        token.lastname = (user as any).lastname;
        token.email = user.email;
        token.role = (user as any).role;
        token.avatarUrl = (user as any).avatarUrl;
        token.isPremium = (user as any).isPremium; // 👈 GUARDAMOS EN TOKEN
        token.backendToken = (user as any).token;
      }

      // 2. Login con Google
      if (account?.provider === "google" && profile) {
        const googleProfile = profile as GoogleProfile;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/register-google`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              googleId: googleProfile.sub,
              email: googleProfile.email,
              name: googleProfile.given_name,
              lastname: googleProfile.family_name,
              avatarUrl: googleProfile.picture,
              // roleId: "USER",
            }),
          },
        );

        const data = await res.json();

        token.backendToken = data.token;
        token.id = data.user.id;
        token.name = data.user.name;
        token.lastname = data.user.lastname;
        token.email = data.user.email;
        token.role = data.user.role;
        token.avatarUrl = data.user.avatarUrl;
        token.isPremium = data.user.isPremium; // 👈 GUARDAMOS EN TOKEN
      }

      // 3. Manejo de Trigger Update (Para refrescar premium sin reloguear)
      // Cuando llamas a await update() desde el front, entra aquí
      if (trigger === "update" && token.backendToken) {
        try {
          // Asumimos que tienes un endpoint para obtener tu propio perfil
          // Si no lo tienes, puedes comentar este bloque, pero el usuario tendrá que reloguear.
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
            {
              // O la ruta donde obtienes tus datos
              method: "GET",
              headers: { Authorization: `Bearer ${token.backendToken}` },
            },
          );

          if (res.ok) {
            const userData = await res.json();
            // Actualizamos los datos del token con lo fresco de la BD
            token.isPremium = userData.isPremium;
            token.role = userData.roleId || userData.role;
          }
        } catch (error) {
          console.error("Error actualizando token de sesión", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.backendToken = token.backendToken as string;

      // Pasamos todo al frontend
      session.user = {
        id: token.id as string,
        name: token.name as string,
        lastname: token.lastname as string,
        email: token.email as string,
        role: token.role as string,
        avatarUrl: token.avatarUrl as string,
        isPremium: token.isPremium as boolean, // 👈 EXPONEMOS AL FRONT
      } as any;

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
