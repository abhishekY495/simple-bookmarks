import { API_URL } from "@/utils/constants";
import {
  BookmarkResponse,
  CreateBookmark,
  PaginatedBookmarkRequest,
  PaginatedBookmarkResponse,
  UpdateBookmark,
} from "@repo/schemas";

export const getBookmarksService = async (
  accessToken: string,
  paginatedBookmarkRequest: PaginatedBookmarkRequest,
): Promise<PaginatedBookmarkResponse> => {
  const finalApiUrl = paginatedBookmarkRequest.cursor
    ? `${API_URL}/bookmark/all?type=${paginatedBookmarkRequest.type}&cursor=${paginatedBookmarkRequest.cursor}&take=${paginatedBookmarkRequest.take}`
    : `${API_URL}/bookmark/all?type=${paginatedBookmarkRequest.type}&take=${paginatedBookmarkRequest.take}`;

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

export const addBookmarkService = async (
  accessToken: string,
  createBookmark: CreateBookmark,
): Promise<BookmarkResponse> => {
  const response = await fetch(`${API_URL}/bookmark/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(createBookmark),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message ?? "Failed to add bookmark");
  }
  return data;
};

export const deleteBookmarkService = async (
  accessToken: string,
  bookmarkId: string,
): Promise<void> => {
  const response = await fetch(`${API_URL}/bookmark/${bookmarkId}`, {
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
    throw new Error(data?.message ?? "Failed to delete bookmark");
  }
};

export const updateBookmarkService = async (
  accessToken: string,
  bookmarkId: string,
  updateBookmark: UpdateBookmark,
): Promise<BookmarkResponse> => {
  const response = await fetch(`${API_URL}/bookmark/${bookmarkId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(updateBookmark),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message ?? "Failed to update bookmark");
  }
  return data;
};
