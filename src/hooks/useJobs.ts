import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";
import { CreateJobDto } from "../api/Api";

// GET list
export const useJobs = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["jobs", page],
    queryFn: async () => {
      const res = await api.jobs.jobsControllerFindAll();
      return res.data;
    },
  });
};


// GET one job
export const useJob = (id: string) => {
  return useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const res = await api.jobs.jobsControllerFindOne(id);
      return res.data.job || res.data;
    },
  });
};

// CREATE
export const useCreateJob = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateJobDto) => {
      const res = await api.jobs.jobsControllerCreate(payload);
      return res.data;
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
    mutationFn: async (payload: any) => {
      const res = await api.jobCandidate.jobCandidateControllerUpdate(id, payload);
      return res.data;
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
      const res = await api.jobs.jobsControllerRemove(id);
      return res.data;
    },
    onSuccess() {
      client.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};
