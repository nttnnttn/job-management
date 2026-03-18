import { jwtDecode } from "jwt-decode";

export interface IUserToken {
  userId: string;
  email: string;
  role: string;
}

export function useAuth(): IUserToken | null {
  const token = localStorage.getItem("access_token");

  if (!token) return null;

  try {
    return jwtDecode<IUserToken>(token);
  } catch (error) {
    console.error("Token decode error:", error);
    return null;
  }
}
