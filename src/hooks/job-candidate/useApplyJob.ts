import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applyJob } from "../../api/jobCandidate.api";

export const useApplyJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyJob,
    onSuccess: () => {
      // reload jobs + applications
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
    },
  });
};
