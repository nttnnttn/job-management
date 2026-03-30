export interface IUser {
  _id: string;
  email: string;
  fullName?: string;
  phone?: string;
  level?: "intern" | "junior" | "middle" | "senior";
  role?: string;
}

export type UserRole = 'candidate' | 'recruiter';