import { 
  jobCandidateControllerApplyJobs,jobCandidateControllerGetCandidatesByJob,
  jobCandidateControllerGetMyApplications,
} from "../api-client";

/**
 * POST /job-candidate
 */
export const applyJob = async ({jobId,}: {jobId: string}) => {
  const res = await jobCandidateControllerApplyJobs({
    body: {
      job: jobId,
      status: "applied",
    },
  });

  return res.data;
};

/**
 * GET /job-candidate/job/:jobId
 */
export const getCandidatesByJob = async (jobId: string) => {
  const res = await jobCandidateControllerGetCandidatesByJob({
    path: { jobId },
  });

  return res.data;
};

export const getMyApplications = async () => {
  const res = await jobCandidateControllerGetMyApplications();
  return res.data;
};
