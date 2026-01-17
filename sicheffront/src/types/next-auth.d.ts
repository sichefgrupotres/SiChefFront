import NextAuth from "next-auth";
export type SubscriptionStatus = "FREE" | "SUBSCRIBER" | "EXPIRED";

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

export interface UserSuscript {
  id: string;
  name: string;
  email: string;
  roleId: string;
  blocked: boolean;
  status: string;
  subscriptionStatus: SubscriptionStatus;
  subscriptionUntil?: string;
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
