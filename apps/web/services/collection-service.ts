import { API_URL } from "@/utils/constants";
import {
  CollectionResponse,
  CreateCollection,
  PaginatedCollectionRequest,
  PaginatedCollectionResponse,
} from "@repo/schemas";

export const addCollectionService = async (
  accessToken: string,
  createCollection: CreateCollection,
): Promise<CollectionResponse> => {
  const response = await fetch(`${API_URL}/collection/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(createCollection),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message ?? "Failed to add collection");
  }
  return data;
};

export const getCollectionsService = async (
  accessToken: string,
  paginatedCollectionRequest: PaginatedCollectionRequest,
): Promise<PaginatedCollectionResponse> => {
  const finalApiUrl = paginatedCollectionRequest.cursor
    ? `${API_URL}/collection/all?cursor=${paginatedCollectionRequest.cursor}&take=${paginatedCollectionRequest.take}`
    : `${API_URL}/collection/all?take=${paginatedCollectionRequest.take}`;

  const response = await fetch(finalApiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message ?? "Failed to get collections");
  }
  return data;
};

export const deleteCollectionService = async (
  accessToken: string,
  collectionId: string,
): Promise<void> => {
  const response = await fetch(`${API_URL}/collection/${collectionId}`, {
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
    throw new Error(data?.message ?? "Failed to delete collection");
  }
};

export const getCollectionByIdService = async (
  accessToken: string,
  collectionId: string,
): Promise<CollectionResponse> => {
  const response = await fetch(`${API_URL}/collection/${collectionId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message ?? "Failed to get collection by id");
  }
  return data;
};
