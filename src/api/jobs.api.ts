import { CreateJobDto, 
  jobsControllerCreate, 
  jobsControllerFindAll, 
  jobsControllerFindOne, 
  jobsControllerRemove, 
  jobsControllerUpdate, 
  UpdateJobDto } from "../api-client";

/**
 * GET /jobs?query
 */
// const res = await authControllerSignIn({ body: {email, password}});
export const getJobs = async (params?: any) => {
  const res = await jobsControllerFindAll({query: params});
  return res.data;
};

/**
 * GET /jobs/{jobId}
 */
export const getJobById = async (jobId: string) => {
  const res = await jobsControllerFindOne({path: {id: jobId}});
  return res.data;
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
