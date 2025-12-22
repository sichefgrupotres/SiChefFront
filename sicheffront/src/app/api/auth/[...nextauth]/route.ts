import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProviders from "next-auth/providers/credentials";

export const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_0AUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_0AUTH_CLIENT_SECRET!,
    }),
    CredentialsProviders({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
    })
  ],
  
})

export {handler as GET, handler as POST};