import { API_URL } from "@/utils/constants";
import { UserFullName, UserResponse } from "@repo/schemas";

export const updateUserFullNameService = async (
  userFullName: UserFullName,
  token: string,
): Promise<UserResponse> => {
  const response = await fetch(`${API_URL}/user/full-name`, {
    method: "PUT",
    body: JSON.stringify(userFullName),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message ?? "Failed to update full name");
  }
  return data;
};
