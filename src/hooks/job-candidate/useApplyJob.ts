import { useMutation } from "@tanstack/react-query";
import { applyJob } from "../../api/jobCandidate.api";

export const useApplyJob = () => {
  return useMutation({
    mutationFn: ({
      jobId,
    }: {
      jobId: string;
    }) => applyJob({ jobId, }),
  });
};
