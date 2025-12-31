import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    backendToken?: string;
    user: {
      id?: string;
      roleId?: string;
      email?: string;
      name?: string;
      lastname?: string;
    } & DefaultSession["user"];
  }

  interface User {
    roleId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string;
    user?: {
      id?: string;
      roleId?: string;
      email?: string;
      name?: string;
      lastname?: string;
    };
  }
}
