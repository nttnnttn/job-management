import client from "./client";

/**
 * GET /jobs?query
 */
export const getJobs = async (params?: any) => {
  const query = new URLSearchParams(params).toString();
  const res = await client.jobs.jobsControllerFindAll();
  return res.data;
};

/**
 * GET /jobs/{jobId}
 */
export const getJobById = async (jobId: string) => {
  const res = await client.jobs.jobsControllerFindOne(jobId);
  return res.data;
};

/**
 * POST /jobs
 */
export const createJob = async (payload: any) => {
  const res = await client.jobs.jobsControllerCreate(payload);
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
  const res = await client.jobs.jobsControllerUpdate(jobId, payload);
  return res.data;
};

/**
 * DELETE /jobs/{jobId}
 */
export const deleteJob = async (jobId: string) => {
  const res = await client.jobs.jobsControllerRemove(jobId);
  return res.data;
};
