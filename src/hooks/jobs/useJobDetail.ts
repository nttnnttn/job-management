import { useQuery } from "@tanstack/react-query";
import { getJobById } from "../../api/jobs.api";
import { jobKeys } from "./keys";

export const useJobDetail = (jobId: string) => {
  return useQuery({
    queryKey: jobKeys.detail(jobId),
    queryFn: () => getJobById(jobId),
    enabled: !!jobId,
  });
};

