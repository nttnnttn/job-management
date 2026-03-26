import { useQuery } from "@tanstack/react-query";
import { jobCandidateControllerGetMyApplications } from "../../api-client";

export const useMyApplications = () => {
  return useQuery({
    queryKey: ["my-applications"],
    queryFn: async () => {
      const res = await jobCandidateControllerGetMyApplications();
      return res.data || []; // ✅ luôn trả array
    },
  });
};
