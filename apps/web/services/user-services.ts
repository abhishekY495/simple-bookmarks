import { API_URL } from "@/utils/constants";
import { UpdateUserFullName, UserResponse } from "@repo/schemas";

export const updateFullNameService = async (
  updateUserFullName: UpdateUserFullName,
  token: string,
): Promise<UserResponse> => {
  const response = await fetch(`${API_URL}/user/full-name`, {
    method: "PUT",
    body: JSON.stringify(updateUserFullName),
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
