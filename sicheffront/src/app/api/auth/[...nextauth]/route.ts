import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";

export const authOptions = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET as string,
    }),
  ],
 callbacks: {
   async jwt({ token, account, profile }) {
    if (account && profile) {
      const role = (await cookies()).get("selected_role")?.value || "USER";

      const response = await fetch("http://localhost:3001/auth/register-google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          googleId: profile.sub,
          email: profile.email,
          name: profile.given_name,
          lastname: profile.family_name,
          roleId: role,
        }),
      });

      const data = await response.json();

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
  session: { strategy: "jwt" },
});

export const GET = authOptions.handlers.GET;
export const POST = authOptions.handlers.POST;
