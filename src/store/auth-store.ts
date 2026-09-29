import { create } from "zustand";

export type Role =
  | "STUDENT"
  | "INSTRUCTOR"
  | "DEPARTMENT_ADMIN"
  | "REGISTRAR"
  | "FINANCE_ADMIN"
  | "SUPER_ADMIN";

export type AuthUser = {
  userId: string;
  name: string;
  email: string;
  role: Role;
};

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  setAuth: (user: AuthUser, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
  finishHydrating: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isHydrating: true,

  setAuth: (user, accessToken) => {
    document.cookie = `session-role=${user.role}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
    set({ user, accessToken, isAuthenticated: true });
  },

  setAccessToken: (accessToken) => set({ accessToken }),

  clearAuth: () => {
    document.cookie = "session-role=; path=/; max-age=0";
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  finishHydrating: () => set({ isHydrating: false }),
}));
