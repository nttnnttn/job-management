import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../api/users.api";
import { UserDto } from "../../api-client";

export const useProfile = () => {
  return useQuery<UserDto>({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
};
