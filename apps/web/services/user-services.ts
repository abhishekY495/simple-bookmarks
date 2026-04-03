import { API_URL } from "@/utils/constants";
import {
  UserEmail,
  UserFullName,
  UserPassword,
  UserResponse,
} from "@repo/schemas";

export const updateUserFullNameService = async (
  userFullName: UserFullName,
  accessToken: string,
): Promise<UserResponse> => {
  const response = await fetch(`${API_URL}/user/full-name`, {
    method: "PUT",
    body: JSON.stringify(userFullName),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message ?? "Failed to update full name");
  }
  return data;
};

export const updateUserPasswordService = async (
  userPassword: UserPassword,
  accessToken: string,
): Promise<UserResponse> => {
  const response = await fetch(`${API_URL}/user/password`, {
    method: "PUT",
    body: JSON.stringify(userPassword),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message ?? "Failed to update password");
  }
  return data;
};

export const updateUserEmailService = async (
  userEmail: UserEmail,
  accessToken: string,
): Promise<UserResponse> => {
  const response = await fetch(`${API_URL}/user/email`, {
    method: "PUT",
    body: JSON.stringify(userEmail),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message ?? "Failed to update email");
  }
  return data;
};
