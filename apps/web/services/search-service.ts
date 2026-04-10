import { API_URL } from "@/utils/constants";
import { SearchResponse } from "@repo/schemas";

export const searchService = async (
  accessToken: string,
  query: string,
): Promise<SearchResponse> => {
  const response = await fetch(`${API_URL}/search?query=${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message ?? "Failed to search");
  }
  return data;
};
