import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createJob } from "../../api/jobs.api";
import { jobKeys } from "./keys";

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobKeys.lists(),
      });
    },
  });
};
