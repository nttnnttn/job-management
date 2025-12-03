import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateJob } from "../../api/jobs.api";
import { jobKeys } from "./keys";

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, payload }: { jobId: string; payload: any }) =>
      updateJob({ jobId, payload }),
    onSuccess: (_data, variables) => {
      alert("Update thành công!");
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(variables.jobId) });
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
    },
    onError: (error: any) => {
      console.error("Update job failed:", error.response?.status, error.response?.data);
      alert("Update thất bại!");
    },
  });
};
