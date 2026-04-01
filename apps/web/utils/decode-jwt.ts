import { UserResponse } from "@repo/schemas";

export const decodeJwt = (token: string): UserResponse | null => {
  try {
    const payload = token.split(".")[1];
    const decodedPayload = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );
    return decodedPayload;
  } catch {
    return null;
  }
};
