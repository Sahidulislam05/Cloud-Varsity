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

/**
 * Client-side UX cookie for proxy.ts route gating.
 *
 * Written here from roles the backend has already verified (login/refresh +
 * /user/me). Non-httpOnly on purpose, so clearAuth can remove it when a
 * session ends without a logout call (e.g. a failed refresh).
 *
 * It is NOT a security boundary: it only routes. Every protected page is
 * re-verified by DashboardShell after hydration, and all data access is
 * authorized server-side via the Bearer token + role checks.
 */
const ROLE_COOKIE = "cv_role";
const ROLE_COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days, matches refresh TTL

const secureFlag = () =>
  window.location.protocol === "https:" ? "; secure" : "";

const writeRoleCookie = (role: Role) => {
  document.cookie = `${ROLE_COOKIE}=${role}; path=/; max-age=${ROLE_COOKIE_MAX_AGE}; samesite=lax${secureFlag()}`;
};

const clearRoleCookie = () => {
  document.cookie = `${ROLE_COOKIE}=; path=/; max-age=0; samesite=lax`;
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
  updateUser: (patch: Partial<AuthUser>) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isHydrating: true,

  setAuth: (user, accessToken) => {
    writeRoleCookie(user.role);
    set({ user, accessToken, isAuthenticated: true });
  },

  setAccessToken: (accessToken) => set({ accessToken }),

  clearAuth: () => {
    clearRoleCookie();
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  updateUser: (patch) =>
    set((state) =>
      state.user ? { user: { ...state.user, ...patch } } : state,
    ),

  finishHydrating: () => set({ isHydrating: false }),
}));
