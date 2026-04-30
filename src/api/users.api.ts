import { UpdateProfileUserDto, UserDto, usersControllerGetProfile, usersControllerPublicCandidateProfile, usersControllerUpdateProfile, UsersControllerUpdateProfileData } from "../api-client";

export const getProfile = async (): Promise<UserDto> => {
  const res = await usersControllerGetProfile({});
  if ("data" in res && res.data) return res.data;

  throw new Error("Get profile failed");
};

export const getPublicProfile = async (candidateId: string): Promise<UserDto> => {
  const res = await usersControllerPublicCandidateProfile({
    path: {
      candidateId
    }
  });
  if ("data" in res && res.data) return res.data;

  throw new Error("Get profile failed");
};


export const updateProfile = async  (data: UpdateProfileUserDto) => {
  const res = await usersControllerUpdateProfile({
    body: data,
  });
  if ("data" in res) return res.data;

  throw new Error("Update profile failed");
};
