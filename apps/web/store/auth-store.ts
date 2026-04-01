import { UserResponse } from "@repo/schemas";
import { create } from "zustand";

interface AuthState {
  user: UserResponse | null;
  isRestoring: boolean;
  setAuth: (user: UserResponse | null) => void;
  clearAuth: () => void;
  setIsRestoring: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isRestoring: true,
  setAuth: (user) => set({ user }),
  clearAuth: () => set({ user: null }),
  setIsRestoring: (value) => set({ isRestoring: value }),
}));
