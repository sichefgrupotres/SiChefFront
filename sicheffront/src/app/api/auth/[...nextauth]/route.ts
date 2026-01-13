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

        const res = await fetch("http://localhost:3001/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!res.ok) return null;

        const data = await res.json();

        if (!data?.token || !data?.user?.id) return null;

        return {
          id: data.user.id,
          name: data.user.name,
          lastname: data.user.lastname,
          email: data.user.email,
          role: data.user.role,
          avatarUrl: data.user.avatarUrl,
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
      if (user) {
        token.id = (user as any).id;
        token.name = user.name;
        token.lastname = (user as any).lastname;
        token.email = user.email;
        token.role = (user as any).role;
        token.avatarUrl = (user as any).avatarUrl;
        token.backendToken = (user as any).token;
      }

      if (account?.provider === "google" && profile) {
        const googleProfile = profile as GoogleProfile;
        const res = await fetch("http://localhost:3001/auth/register-google", {
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
        });

        const data = await res.json();

        token.backendToken = data.token;
        token.id = data.user.id;
        token.name = data.user.name;
        token.lastname = data.user.lastname;
        token.email = data.user.email;
        token.role = data.user.role;
        token.avatarUrl = data.user.avatarUrl;
      }

      if (trigger === "update" && session?.user?.avatarUrl) {
        token.avatarUrl = session.user.avatarUrl;
      }

      return token;
    },

    async session({ session, token }) {
      session.backendToken = token.backendToken as string;

      session.user = {
        id: token.id as string,
        name: token.name as string,
        lastname: token.lastname as string,
        email: token.email as string,
        role: token.role as string,
        avatarUrl: token.avatarUrl as string,
      };

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
