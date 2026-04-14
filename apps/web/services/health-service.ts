import { API_URL } from "@/utils/constants";

export const healthService = async (): Promise<{
  message: string;
  statusCode: number;
}> => {
  if (!API_URL) {
    throw new Error("Backend URL is not configured");
  }

  const response = await fetch(`${API_URL}/health`, {
    method: "GET",
    cache: "no-store",
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Failed to get health");
  }

  return data;
};
