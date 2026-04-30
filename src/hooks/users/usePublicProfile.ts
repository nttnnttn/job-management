import { useQuery } from "@tanstack/react-query";
import { getPublicProfile } from "../../api/users.api";
import { UserDto } from "../../api-client";

export const usePublicProfile = (candidateId: string) => {
  return useQuery<UserDto>({
    queryKey: ["publicprofile"],
    queryFn: () => getPublicProfile(candidateId),
  });
};
