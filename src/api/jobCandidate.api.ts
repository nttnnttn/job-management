import { 
  jobCandidateControllerApplyJobs,jobCandidateControllerGetCandidatesByJob,
} from "../api-client";

/**
 * POST /job-candidate
 */
export const applyJob = async ({jobId,userId,}: {jobId: string;userId: string;}) => {
  const res = await jobCandidateControllerApplyJobs({
    body: {
      job: jobId,
      user: userId,
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
