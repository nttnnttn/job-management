import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../../api/users.api";
import { UpdateProfileUserDto } from "../../api-client";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileUserDto) => updateProfile (data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["profile"]});
    },

    onError: (error: unknown) => {
        console.error("Update profile failed:", error);
    },
  });
};
