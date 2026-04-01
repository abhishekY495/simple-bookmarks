import {
  LoginUser,
  RefreshTokenResponse,
  RegisterUser,
  UserResponse,
} from "@repo/schemas";

export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  const response = await fetch("/api/auth/refresh-token", {
    method: "POST",
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message ?? "Refresh token failed");
  }
  return data;
};

export const register = async (
  registerUser: RegisterUser,
): Promise<UserResponse> => {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(registerUser),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message ?? "Registration failed");
  }
  return data;
};

export const login = async (loginUser: LoginUser): Promise<UserResponse> => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(loginUser),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message ?? "Login failed");
  }
  return data;
};
