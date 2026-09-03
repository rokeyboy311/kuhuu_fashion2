import { Response } from 'express';

interface SuccessResponseOptions<T> {
  res: Response;
  data?: T;
  message?: string;
  statusCode?: number;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export function successResponse<T>({
  res,
  data,
  message = 'Success',
  statusCode = 200,
  meta,
}: SuccessResponseOptions<T>): Response {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta && { meta }),
  });
}

export function createdResponse<T>({
  res,
  data,
  message = 'Created successfully',
}: Omit<SuccessResponseOptions<T>, 'statusCode'>): Response {
  return successResponse({ res, data, message, statusCode: 201 });
}

export function paginatedResponse<T>({
  res,
  data,
  message = 'Success',
  page,
  limit,
  total,
}: {
  res: Response;
  data: T;
  message?: string;
  page: number;
  limit: number;
  total: number;
}): Response {
  return successResponse({
    res,
    data,
    message,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
