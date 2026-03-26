import { CreateJobDto, 
  jobsControllerCreate, 
  jobsControllerFindAll, 
  jobsControllerFindOne, 
  jobsControllerRemove, 
  jobsControllerUpdate, 
  UpdateJobDto } from "../api-client";
import { Job } from "../types/job";

/**
 * GET /jobs?query
 */
// const res = await authControllerSignIn({ body: {email, password}});
export const getJobs = async (params?: any): Promise <Job[]> => {
  try {
    const res = await jobsControllerFindAll({ query: params });
    const data = res.data ?? [];
    if (!Array.isArray(data)) return [];

    return data as Job[];
  } catch (error) {
    console.error("getJobs error:", error);
    return [];
  }
};

/**
 * GET /jobs/{jobId}
 */
export const getJobById = async (jobId: string): Promise<Job> => {
  try {
    const res = await jobsControllerFindOne({path: {id: jobId}});

    const item = res.data;

    if (!item) throw new Error("Job not found");

    return item as Job;
  } catch (error) {
    console.error("getJobById error:", error);
    throw error;
  }
};

/**
 * POST /jobs
 */
export const createJob = async (createJob: CreateJobDto) => {
  const res = await jobsControllerCreate({body: createJob});
  return res.data;
};

/**
 * PUT /jobs/{jobId}
 */
export const updateJob = async ({
  jobId,
  bodyJob,
}: {
  jobId: string;
  bodyJob: UpdateJobDto;
}) => {
  const res = await jobsControllerUpdate({path: {id: jobId}, body: bodyJob});
  return res.data;
};

/**
 * DELETE /jobs/{jobId}
 */
export const deleteJob = async (jobId: string) => {
  const res = await jobsControllerRemove({path: {id: jobId}});
  return res.data;
};
