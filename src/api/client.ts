import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import env from "../config/env";
import { parseApiError } from "./types/errors";
import { logger } from "../utils/logger";

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

function requestUrl(config: InternalAxiosRequestConfig): string {
  const base = config.baseURL ?? "";
  const path = config.url ?? "";
  return `${base}${path}`;
}

// Request interceptor — attach auth token before every request
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    logger.debug(
      `[API] → ${config.method?.toUpperCase() ?? "GET"} ${requestUrl(config)}`,
    );

    // TODO: retrieve and attach your auth token here, for example:
    // const token = await getAuthToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(parseApiError(error)),
);

// Response interceptor — normalise all errors into ApiError
apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    const cfg = error.config;
    logger.warn("[API] ✕ request failed", {
      url: cfg ? requestUrl(cfg) : undefined,
      method: cfg?.method,
      message: error.message,
      axiosCode: error.code,
      httpStatus: error.response?.status,
      baseURL: cfg?.baseURL,
    });
    return Promise.reject(parseApiError(error));
  },
);

export async function get<T>(
  endpoint: string,
  params?: Record<string, unknown>,
): Promise<T> {
  const response = await apiClient.get<T>(endpoint, { params });
  return response.data;
}

export async function post<T>(
  endpoint: string,
  data?: unknown,
  params?: Record<string, unknown>,
): Promise<T> {
  const response = await apiClient.post<T>(endpoint, data, { params });
  return response.data;
}

export async function put<T>(
  endpoint: string,
  data?: unknown,
  params?: Record<string, unknown>,
): Promise<T> {
  const response = await apiClient.put<T>(endpoint, data, { params });
  return response.data;
}

export async function patch<T>(
  endpoint: string,
  data?: unknown,
  params?: Record<string, unknown>,
): Promise<T> {
  const response = await apiClient.patch<T>(endpoint, data, { params });
  return response.data;
}

export async function del<T>(
  endpoint: string,
  params?: Record<string, unknown>,
): Promise<T> {
  const response = await apiClient.delete<T>(endpoint, { params });
  return response.data;
}
