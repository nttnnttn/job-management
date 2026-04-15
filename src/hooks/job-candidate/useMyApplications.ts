import { useQuery } from '@tanstack/react-query';
import { jobCandidateControllerGetMyApplications } from '../../api-client';
import { useAuth } from '../useAuth';

export const useMyApplications = () => {
  const auth = useAuth();

  return useQuery({
    queryKey: ['my-applications'],
    enabled: auth?.role === 'candidate',
    queryFn: async () => {
      const res = await jobCandidateControllerGetMyApplications();
      return res.data || [];
    },
  });
};
