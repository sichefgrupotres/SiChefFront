export interface AuthSessionUser {
  id?: string;
  email: string;
  name?: string;
  lastname?: string;
  roleId: "USER" | "CREATOR";
  avatarUrl?: string;
}

export interface AuthSession {
  token: string;
  user: AuthSessionUser;
}
