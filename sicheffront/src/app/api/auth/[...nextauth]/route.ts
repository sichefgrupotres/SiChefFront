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
  async jwt({ token, user, account, profile }) {
    if (account && profile) {
      const cookieStore = cookies();
      const roleId = (await cookieStore).get("selected_role")?.value || "USER";

      const googleId = profile.sub;

      const response = await fetch(
        "http://localhost:3001/auth/register-google",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            googleId,
            email: profile.email,
            name: profile.given_name,
            lastname: profile.family_name,
            roleId,
          }),
        }
      );

      const data = await response.json();

      // 🔥 GUARDAMOS LO IMPORTANTE
      token.backendToken = data.token;
      token.user = data.user;
    }

    return token;
  },

  async session({ session, token }) {
    session.user = token.user as any;
    session.backendToken = token.backendToken as string;
    return session;
  },
  },
  session: { strategy: "jwt" },
});

export const GET = authOptions.handlers.GET;
export const POST = authOptions.handlers.POST;
