import {
  jobCandidateControllerApplyJobs,
  jobCandidateControllerGetCandidatesByJob,
  jobCandidateControllerGetHistoryApplied,
  jobCandidateControllerGetMyApplications,
} from '../api-client';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

const authHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const applyJob = async ({ jobId }: { jobId: string }) => {
  const token = localStorage.getItem('access_token');

  const res = await jobCandidateControllerApplyJobs({
    body: {
      job: jobId,
      status: 'applied',
    },
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (res.error) {
    throw res.error;
  }
  return res.data;
};

export const getCandidatesByJob = async (jobId: string) => {
  const token = localStorage.getItem('access_token');

  const res = await jobCandidateControllerGetCandidatesByJob({
    path: { jobId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const updateApplicationStatus = async (applicationId: string, status: 'approved' | 'rejected') => {
  const res = await fetch(`${API_BASE}/job-candidate/${applicationId}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error((await res.text()) || 'Update failed');
  }

  return res.json();
};

export const getAdminApplications = async () => {
  const res = await fetch(`${API_BASE}/job-candidate/admin/overview`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error((await res.text()) || 'Fetch failed');
  }

  return res.json();
};

export const getMyApplications = async () => {
  const token = localStorage.getItem('access_token');

  const res = await jobCandidateControllerGetMyApplications({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getMyApplicationHistory = async () => {
  const token = localStorage.getItem('access_token');

  const res = await jobCandidateControllerGetHistoryApplied({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.error) {
    throw res.error;
  }

  return res.data || [];
};
