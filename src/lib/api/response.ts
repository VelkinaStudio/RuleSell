import { NextResponse } from "next/server";
import type {
  ApiSuccessResponse,
  ApiListResponse,
  ApiErrorResponse,
  PaginationMeta,
} from "@/types";

export function success<T>(data: T, status = 200): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({ data }, { status });
}

export function list<T>(
  data: T[],
  pagination: PaginationMeta,
): NextResponse<ApiListResponse<T>> {
  return NextResponse.json({ data, pagination });
}

export function error(
  code: string,
  message: string,
  status: number,
  details?: Record<string, unknown>,
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    { error: { code, message, ...(details && { details }) } },
    { status },
  );
}

export const errors = {
  validation: (message: string, details?: Record<string, unknown>) =>
    error("VALIDATION_ERROR", message, 400, details),
  unauthorized: (message = "Authentication required") =>
    error("UNAUTHORIZED", message, 401),
  forbidden: (message = "Insufficient permissions") =>
    error("FORBIDDEN", message, 403),
  notFound: (message = "Resource not found") =>
    error("NOT_FOUND", message, 404),
  conflict: (message: string) =>
    error("CONFLICT", message, 409),
  rateLimited: (message = "Too many requests") =>
    error("RATE_LIMITED", message, 429),
  internal: (message = "Internal server error") =>
    error("INTERNAL_ERROR", message, 500),
};

export function paginationFromOffset(
  total: number,
  page: number,
  pageSize: number,
): PaginationMeta {
  return {
    total,
    page,
    pageSize,
    hasNext: page * pageSize < total,
    hasPrev: page > 1,
  };
}

export function paginationFromCursor(
  total: number,
  pageSize: number,
  nextCursor?: string,
): PaginationMeta {
  return {
    total,
    page: 0,
    pageSize,
    hasNext: !!nextCursor,
    hasPrev: false,
    nextCursor,
  };
}
