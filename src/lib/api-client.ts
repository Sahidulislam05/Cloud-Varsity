import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth-store";

// Same-origin path; next.config.ts rewrites it to the backend (API_URL).
const API_URL = "/api/v1";

export class ApiError extends Error {
  statusCode: number;
  errors: { field?: string; message: string }[];

  constructor(
    statusCode: number,
    message: string,
    errors: { field?: string; message: string }[],
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: { page: number; limit: number; total: number; totalPages: number };
};

// Same-origin requests send the httpOnly refresh cookie automatically.
export const apiClient = axios.create({ baseURL: API_URL });

// প্রতিটা request এ store থেকে access token তুলে Bearer header এ বসানো
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// একসাথে অনেকগুলো request 401 পেলে যেন refresh call একবারই হয় (deduplication)
let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<ApiResponse<{ accessToken: string }>>(
        `${API_URL}/auth/refresh-token`,
      )
      .then((res) => {
        const token = res.data.data.accessToken;
        useAuthStore.getState().setAccessToken(token);
        return token;
      })
      .catch(() => {
        // Only bounce to /login when a real session existed (user is
        // hydrated). During hydration on a public page the user is still
        // null and DashboardShell/anonymous views handle their own state.
        const { user, clearAuth } = useAuthStore.getState();
        const hadSession = Boolean(user);
        clearAuth();
        if (hadSession && typeof window !== "undefined") {
          window.location.assign("/login");
        }
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (
    error: AxiosError<{
      message?: string;
      errors?: { field?: string; message: string }[];
    }>,
  ) => {
    const originalRequest = error.config as
      | (AxiosRequestConfig & { _retried?: boolean })
      | undefined;

    const isAuthCall = originalRequest?.url?.startsWith("/auth/");
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retried &&
      !isAuthCall
    ) {
      originalRequest._retried = true;
      const newToken = await refreshAccessToken();

      if (newToken) {
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return apiClient(originalRequest);
      }
    }

    const message =
      error.response?.data?.message ?? error.message ?? "Something went wrong";
    const errors = error.response?.data?.errors ?? [{ message }];
    return Promise.reject(
      new ApiError(error.response?.status ?? 500, message, errors),
    );
  },
);
