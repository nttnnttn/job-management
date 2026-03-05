import client from "./client";

/**
 * GET /jobs?query
 */
export const getJobs = async (params?: any) => {
  const query = new URLSearchParams(params).toString();
  const res = await client.get(`/jobs?${query}`);
  return res.data;
};

/**
 * GET /jobs/{jobId}
 */
export const getJobById = async (jobId: string) => {
  const res = await client.get(`/jobs/{jobId}?jobId=${jobId}`);
  return res.data;
};

/**
 * POST /jobs
 */
export const createJob = async (payload: any) => {
  const res = await client.post("/jobs", payload);
  return res.data;
};

/**
 * PUT /jobs/{jobId}
 */
export const updateJob = async ({
  jobId,
  payload,
}: {
  jobId: string;
  payload: any;
}) => {
  const res = await client.put(`/jobs/${jobId}`, payload);
  return res.data;
};

/**
 * DELETE /jobs/{jobId}
 */
export const deleteJob = async (jobId: string) => {
  const res = await client.delete(`/jobs/${jobId}`);
  return res.data;
};
