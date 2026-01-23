export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  lastname?: string;
  roleId: "USER" | "CREATOR";
  
}

export interface userSessionInterface {
  token: string;
  user: AuthUser;
}

