export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  status: string;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  isApplied?: boolean;
}
