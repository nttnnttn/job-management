import { useQuery } from "@tanstack/react-query";
import { jobCandidateControllerGetHistoryApplied } from "../../api-client";

export const useMyApplicationHistory = () => {
  return useQuery({
    queryKey: ["my-application-history"],
    queryFn: async () => {
      const token = localStorage.getItem("access_token");

      const res = await jobCandidateControllerGetHistoryApplied({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data || [];
    },
  });
};
