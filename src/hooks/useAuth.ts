import { jwtDecode } from "jwt-decode";

export interface IUserToken {
  userId: string;
  email: string;
  role: string;
  exp?: number;
}

export function useAuth(): IUserToken | null {
  const token = localStorage.getItem("access_token");

  if (!token) return null;

  try {
    const decoded = jwtDecode<IUserToken>(token);

    // check hết hạn
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("access_token");
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Token decode error:", error);
    return null;
  }
}
