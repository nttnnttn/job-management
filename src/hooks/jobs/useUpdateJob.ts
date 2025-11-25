import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateJob } from "../../api/jobs.api";
import { jobKeys } from "./keys";

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateJob,
    onSuccess: (_, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(jobId) });
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
    },
  });
};

