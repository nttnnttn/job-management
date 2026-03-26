import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../api/users.api";
import { IUser } from "../../types/user";

export const useProfile = () => {
  return useQuery<IUser>({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
};
