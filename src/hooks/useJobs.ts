import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createJob, deleteJob, getJobById, getJobs, updateJob } from "../api/jobs.api";
import { CreateJobDto, UpdateJobDto } from "../api-client";
import { Job } from "../types/job";

// GET list
export const paginationJobs = (page: number, limit: number) => {
  return useQuery<Job[]>({
    queryKey: ["jobs", page],
    queryFn: async () => {
      const data = await getJobs();
      return data;
    },
  });
};

// GET one job
export const useJob = (id: string) => {
  return useQuery<Job>({
    queryKey: ["job", id],
    queryFn: () => getJobById(id),
    enabled: !!id,
  });
};

// CREATE
export const useCreateJob = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateJobDto) => {
      const res = await createJob(payload);
      return res;
    },
    onSuccess() {
      client.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};

// UPDATE
export const useUpdateJob = (id: string) => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateJobDto) => {
      const res = await updateJob({jobId: id , bodyJob: payload});
      return res;
    },
    onSuccess() {
      client.invalidateQueries({ queryKey: ["jobs"] });
      client.invalidateQueries({ queryKey: ["job", id] });
    },
  });
};

// DELETE
export const useDeleteJob = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteJob(id);
      return res;
    },
    onSuccess() {
      client.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};
