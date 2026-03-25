import { 
  jobCandidateControllerApplyJobs,
  jobCandidateControllerGetCandidatesByJob,
  jobCandidateControllerGetMyApplications,
} from "../api-client";

/**
 * POST /job-candidate
 */
export const applyJob = async ({jobId,}: {jobId: string}) => {
  const token = localStorage.getItem("access_token");

  const res = await jobCandidateControllerApplyJobs({
    body: {
      job: jobId,
      status: "applied",
    },
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (res.error) {
    throw res.error;
  }
  return res.data;
};

/**
 * GET /job-candidate/job/:jobId
 */
export const getCandidatesByJob = async (jobId: string) => {
  const token = localStorage.getItem("access_token");

  const res = await jobCandidateControllerGetCandidatesByJob({
    path: { jobId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getMyApplications = async () => {
  const token = localStorage.getItem("access_token");

  const res = await jobCandidateControllerGetMyApplications({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
