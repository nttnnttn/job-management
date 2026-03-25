import { usersControllerGetProfile, usersControllerUpdateProfile, UsersControllerUpdateProfileData } from "../api-client";

export type UpdateProfilePayload = UsersControllerUpdateProfileData["body"];

export const getProfile = async () => {
  const res = await usersControllerGetProfile({});
  if ("data" in res) return res.data;

  throw new Error("Get profile failed");
};

export const updateProfile = async  (data: UsersControllerUpdateProfileData["body"]) => {
  const res = await usersControllerUpdateProfile({
    body: data,
  });
  if ("data" in res) return res.data;

  throw new Error("Update profile failed");
};
