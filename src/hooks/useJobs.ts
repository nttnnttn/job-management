import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";

// GET list
export const useJobs = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["jobs", page],
    queryFn: async () => {
      const res = await api.get(`/jobs?page=${page}&limit=${limit}`);
      return res.data;
    },
  });
};

// GET one job
export const useJob = (id: string) => {
  return useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const res = await api.get(`/jobs/${id}?jobId=${id}`);
      return res.data.job || res.data;
    },
  });
};

// CREATE
export const useCreateJob = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post(`/jobs`, payload);
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
      const res = await api.patch(`/jobs/${id}?jobId=${id}`, payload);
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
      const res = await api.delete(`/jobs/${id}?jobId=${id}`);
      return res.data;
    },
    onSuccess() {
      client.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};
