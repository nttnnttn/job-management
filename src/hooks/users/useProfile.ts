import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../api/users.api";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
};
