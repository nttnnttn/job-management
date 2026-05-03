import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { adminApi } from "../../api/admin.api";

export const useAdminAllConversation = ( limit: number) => {
  return useInfiniteQuery({
    queryKey: ['adminConversations', limit],
    enabled: !!limit,
    queryFn: ({ pageParam }) => adminApi.getAllUserChat(pageParam, limit),
    initialPageParam: 0,
    // Determine the next offset based on current pages
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage) return undefined;
      lastPage = lastPage || {
        total: 0,
        limit,
        offset: 0,
        results: []
      }
      const nextOffset = Number(lastPage.offset) + Number(lastPage.limit);
      return nextOffset  < Number(lastPage.total) ? nextOffset  : undefined;
    },
  });
};
