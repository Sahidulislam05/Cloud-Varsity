import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // cross-origin cookie পাঠাতে/গ্রহণ করতে বাধ্যতামূলক
});

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
        {},
        { withCredentials: true },
      )
      .then((res) => {
        const token = res.data.data.accessToken;
        useAuthStore.getState().setAccessToken(token);
        return token;
      })
      .catch(() => {
        useAuthStore.getState().clearAuth();
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
    const isRefreshCall = originalRequest?.url?.includes("/auth/refresh-token");

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retried &&
      !isRefreshCall
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
