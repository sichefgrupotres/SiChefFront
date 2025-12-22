import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const auth = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
});

export const GET = auth.handlers.GET;
export const POST = auth.handlers.POST;
