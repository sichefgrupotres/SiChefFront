import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const res = await fetch("http://localhost:3001/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!res.ok) {
          console.error("Backend signin failed");
          return null;
        }

        const data = await res.json();

        if (!data?.token || !data?.user?.id) {
          console.error("Respuesta inválida del backend", data);
          return null;
        }

        return {
          id: String(data.user.id),
          name: data.user.name ?? "",
          email: data.user.email,
          role: data.user.role,
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

  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: false,
      },
    },
  },

  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account?.provider === "credentials" && user) {
        token.backendToken = (user as any).token;
        token.user = {
          id: (user as any).id,
          name: user.name,
          email: user.email,
          role: (user as any).role,
        };
      }

      if (account?.provider === "google" && profile) {
        const res = await fetch("http://localhost:3001/auth/register-google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            googleId: profile.sub,
            email: profile.email,
            name: profile.given_name,
            lastname: profile.family_name,
            roleId: "USER",
          }),
        });

        const data = await res.json();

        token.backendToken = data.token;
        token.user = data.user;
      }

      return token;
    },

    async session({ session, token }) {
      session.backendToken = token.backendToken as string;
      session.user = token.user as any;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
