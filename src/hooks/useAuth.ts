import { jwtDecode } from "jwt-decode";

export interface IUserToken {
  sub: string;
  email: string;
  role: string;
}

export function useAuth() {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    return jwtDecode<IUserToken>(token);
  } catch {
    return null;
  }
}
