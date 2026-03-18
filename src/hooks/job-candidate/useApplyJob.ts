import { useMutation } from "@tanstack/react-query";
import { applyJob } from "../../api/jobCandidate.api";

export const useApplyJob = () => {
  return useMutation({
    mutationFn: ({
      jobId,
      userId,
    }: {
      jobId: string;
      userId: string;
    }) => applyJob({ jobId, userId }),
  });
};
