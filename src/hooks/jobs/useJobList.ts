import { useQuery } from "@tanstack/react-query";
import { getJobs } from "../../api/jobs.api";
import { jobKeys } from "./keys";

export const useJobList = (filters: any) => {
  return useQuery({
    queryKey: jobKeys.list(JSON.stringify(filters)),
    queryFn: () => getJobs(filters),
  });
};

