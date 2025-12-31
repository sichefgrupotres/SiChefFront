export interface userSessionInterface {
  login: boolean;
  token: string;
  user: {
    name: string;
    lastname: string;
    email: string;
    password: string;
    confirmPassword: string;
    roleId: string;
  };
}
