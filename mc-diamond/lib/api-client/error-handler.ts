import { ApiError } from '@/types/error';

/**
 * Handle API errors and throw appropriate error messages
 */
export async function handleApiError(response: Response): Promise<void> {
  if (response.ok) return;

  let errorData: any;
  
  try {
    errorData = await response.json();
  } catch (e) {
    // If we can't parse the error response, throw a generic error
    throw new ApiError({
      message: `HTTP error! status: ${response.status}`,
      status: response.status,
    });
  }

  // Handle validation errors
  if (response.status === 400 && errorData.error === 'Validation error') {
    throw new ApiError({
      message: 'Validation failed',
      status: 400,
      details: errorData.details,
      code: 'VALIDATION_ERROR',
    });
  }

  // Handle authentication errors
  if (response.status === 401) {
    throw new ApiError({
      message: errorData.error || 'Unauthorized',
      status: 401,
      code: 'UNAUTHORIZED',
    });
  }

  // Handle forbidden errors
  if (response.status === 403) {
    throw new ApiError({
      message: errorData.error || 'Forbidden',
      status: 403,
      code: 'FORBIDDEN',
    });
  }

  // Handle not found errors
  if (response.status === 404) {
    throw new ApiError({
      message: errorData.error || 'Resource not found',
      status: 404,
      code: 'NOT_FOUND',
    });
  }

  // Handle conflict errors (e.g., duplicate entry)
  if (response.status === 409) {
    throw new ApiError({
      message: errorData.error || 'Conflict',
      status: 409,
      code: 'CONFLICT',
      details: errorData.details,
    });
  }

  // Handle server errors
  if (response.status >= 500) {
    throw new ApiError({
      message: errorData.error || 'Internal server error',
      status: response.status,
      code: 'SERVER_ERROR',
    });
  }

  // Handle other errors
  throw new ApiError({
    message: errorData.error || 'An error occurred',
    status: response.status,
    code: errorData.code || 'UNKNOWN_ERROR',
    details: errorData.details,
  });
}

/**
 * Handle API errors in a consistent way for UI components
 */
export function handleError(error: unknown): { message: string; details?: any } {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return {
      message: error.message,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message || 'An unexpected error occurred',
    };
  }

  return {
    message: 'An unknown error occurred',
  };
}

/**
 * Check if the error is an API error with a specific status code
 */
export function isApiError(error: unknown, status?: number): boolean {
  if (!(error instanceof ApiError)) return false;
  return status === undefined || error.status === status;
}

/**
 * Check if the error is a validation error
 */
export function isValidationError(error: unknown): boolean {
  return isApiError(error, 400) && (error as ApiError).code === 'VALIDATION_ERROR';
}

/**
 * Check if the error is an authentication error
 */
export function isUnauthorizedError(error: unknown): boolean {
  return isApiError(error, 401);
}

/**
 * Check if the error is a forbidden error
 */
export function isForbiddenError(error: unknown): boolean {
  return isApiError(error, 403);
}

/**
 * Check if the error is a not found error
 */
export function isNotFoundError(error: unknown): boolean {
  return isApiError(error, 404);
}

/**
 * Check if the error is a conflict error (e.g., duplicate entry)
 */
export function isConflictError(error: unknown): boolean {
  return isApiError(error, 409);
}
