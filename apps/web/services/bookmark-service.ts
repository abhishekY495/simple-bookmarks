import { API_URL } from "@/utils/constants";
import {
  PaginatedBookmarkRequest,
  PaginatedBookmarkResponse,
} from "@repo/schemas";

export const getBookmarksService = async (
  accessToken: string,
  paginatedBookmarkRequest: PaginatedBookmarkRequest,
): Promise<PaginatedBookmarkResponse> => {
  const finalApiUrl = paginatedBookmarkRequest.cursor
    ? `${API_URL}/bookmark/all?cursor=${paginatedBookmarkRequest.cursor}&take=${paginatedBookmarkRequest.take}`
    : `${API_URL}/bookmark/all?take=${paginatedBookmarkRequest.take}`;

  const response = await fetch(finalApiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message ?? "Failed to get bookmarks");
  }
  return data;
};
