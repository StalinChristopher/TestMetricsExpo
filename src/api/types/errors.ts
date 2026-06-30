import { AxiosError } from "axios";

export interface ApiErrorPayload {
  message: string;
  code?: string;
  status?: number;
}

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code: string = "UNKNOWN_ERROR") {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export function parseApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (error instanceof AxiosError) {
    const status = error.response?.status ?? 0;
    const payload = error.response?.data as ApiErrorPayload | undefined;
    const baseMessage =
      payload?.message ?? error.message ?? "An unexpected error occurred";
    // No response: transport/DNS/TLS/timeout — axios "Network Error" is vague; include axios code (e.g. ERR_NETWORK).
    const message =
      error.response || !error.code
        ? baseMessage
        : `${baseMessage} (${error.code})`;
    const code = payload?.code ?? error.code ?? "NETWORK_ERROR";
    return new ApiError(message, status, code);
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 0);
  }

  return new ApiError("An unexpected error occurred", 0);
}
