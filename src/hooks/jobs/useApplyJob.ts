import { useMutation } from "@tanstack/react-query";
import { applyJob } from "../../api/jobCandidate.api";

export const useApplyJob = () => {
  return useMutation({
    mutationFn: ({
      jobId,
      candidateId,
    }: {
      jobId: string;
      candidateId: string;
    }) => applyJob({ jobId, candidateId }),
  });
};
