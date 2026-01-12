import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    backendToken?: string;
    user: {
      id: string;
      name: string;
      lastname?: string;
      email: string;
      role: string;
      avatarUrl?: string;
    };
  }

  interface User {
    id: string;
    name: string;
    lastname?: string;
    email: string;
    role: string;
    token: string;
    avatarUrl?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
    role?: string;
    backendToken?: string;
    user?: {
      id: string;
      name: string;
      lastname?: string;
      email: string;
      role: string;
      avatarUrl?: string;
    };
  }
}
