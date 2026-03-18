import { useQuery } from "@tanstack/react-query";
import { getCandidatesByJob } from "../../api/jobCandidate.api";

const API = process.env.REACT_APP_API_URL;

export const useCandidatesByJob = (jobId: string) => {
  return useQuery({
    queryKey: ["jobcandidates", jobId],
    queryFn: () => getCandidatesByJob(jobId),
    enabled: !!jobId,
  });
};
