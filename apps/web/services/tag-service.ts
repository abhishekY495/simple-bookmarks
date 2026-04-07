import { API_URL } from "@/utils/constants";
import { PaginatedTagRequest, PaginatedTagResponse } from "@repo/schemas";

export const getTagsService = async (
  accessToken: string,
  paginatedTagRequest: PaginatedTagRequest,
): Promise<PaginatedTagResponse> => {
  const finalApiUrl = paginatedTagRequest.cursor
    ? `${API_URL}/tag/all?cursor=${paginatedTagRequest.cursor}&take=${paginatedTagRequest.take}`
    : `${API_URL}/tag/all?take=${paginatedTagRequest.take}`;

  const response = await fetch(finalApiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message ?? "Failed to get tags");
  }
  return data;
};

export const deleteTagService = async (
  accessToken: string,
  tagId: string,
): Promise<void> => {
  const response = await fetch(`${API_URL}/tag/${tagId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const responseText = await response.text();
  let data: { message?: string } | null = null;
  if (responseText) {
    try {
      data = JSON.parse(responseText) as { message?: string };
    } catch {
      data = null;
    }
  }
  if (!response.ok) {
    throw new Error(data?.message ?? "Failed to delete tag");
  }
};
