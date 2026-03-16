import { 
  jobCandidateControllerCreate 
} from "../api-client";

/**
 * POST /job-candidate
 */
export const applyJob = async ({
  jobId,
  candidateId,
}: {
  jobId: string;
  candidateId: string;
}) => {

  const res = await jobCandidateControllerCreate({
    body: {
      job: jobId,
      candidate: candidateId,
      status: "applied",
    },
  });

  return res.data;
};
