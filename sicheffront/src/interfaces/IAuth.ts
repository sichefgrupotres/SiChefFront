export interface AuthSessionUser {
  id?: string;
  email: string;
  name?: string;
  lastname?: string;
  role: "USER" | "CREATOR" | "ADMIN";
  avatarUrl?: string;
  isPremium: boolean;
}

export interface AuthSession {
  token: string;
  user: AuthSessionUser;
}
