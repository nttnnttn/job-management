import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteJob } from "../../api/jobs.api";
import { jobKeys } from "./keys";

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => deleteJob(jobId),
    onSuccess: () => {
      alert("Xóa job thành công!");
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
    },
    onError: (error: any) => {
      console.error("Delete job failed:", error.response?.status, error.response?.data);
      alert("Xóa job thất bại!");
    },
  });
};
