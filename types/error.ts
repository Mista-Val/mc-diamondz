/**
 * Represents the structure of an API error response
 */
export interface ApiErrorResponse {
  message: string;
  status: number;
  code?: string;
  details?: any;
  stack?: string;
  timestamp?: string;
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  status: number;
  code: string;
  details?: any;
  timestamp: string;

  constructor({
    message,
    status = 500,
    code = 'INTERNAL_SERVER_ERROR',
    details,
  }: {
    message: string;
    status?: number;
    code?: string;
    details?: any;
  }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
    
    // Maintain proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * Convert the error to a plain object for JSON responses
   */
  toJSON(): ApiErrorResponse {
    return {
      message: this.message,
      status: this.status,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp,
      ...(process.env.NODE_ENV === 'development' && { stack: this.stack }),
    };
  }
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  error: unknown,
  options: {
    includeStackTrace?: boolean;
    defaultMessage?: string;
    defaultStatus?: number;
  } = {}
): { status: number; error: ApiErrorResponse } {
  const {
    includeStackTrace = process.env.NODE_ENV === 'development',
    defaultMessage = 'An unexpected error occurred',
    defaultStatus = 500,
  } = options;

  // Handle our custom ApiError
  if (error instanceof ApiError) {
    const errorResponse: ApiErrorResponse = {
      message: error.message,
      status: error.status,
      code: error.code,
      details: error.details,
      timestamp: error.timestamp,
    };

    if (includeStackTrace) {
      errorResponse.stack = error.stack;
    }

    return {
      status: error.status,
      error: errorResponse,
    };
  }

  // Handle native Error objects
  if (error instanceof Error) {
    const errorResponse: ApiErrorResponse = {
      message: error.message || defaultMessage,
      status: defaultStatus,
      code: 'INTERNAL_SERVER_ERROR',
      timestamp: new Date().toISOString(),
    };

    if (includeStackTrace) {
      errorResponse.stack = error.stack;
    }

    return {
      status: defaultStatus,
      error: errorResponse,
    };
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      status: defaultStatus,
      error: {
        message: error || defaultMessage,
        status: defaultStatus,
        code: 'INTERNAL_SERVER_ERROR',
        timestamp: new Date().toISOString(),
      },
    };
  }

  // Handle unknown error types
  return {
    status: defaultStatus,
    error: {
      message: defaultMessage,
      status: defaultStatus,
      code: 'UNKNOWN_ERROR',
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Create a validation error response
 */
export function createValidationErrorResponse(details: any) {
  const error = new ApiError({
    message: 'Validation failed',
    status: 400,
    code: 'VALIDATION_ERROR',
    details,
  });

  return {
    status: error.status,
    error: error.toJSON(),
  };
}

/**
 * Create a not found error response
 */
export function createNotFoundError(message = 'Resource not found') {
  const error = new ApiError({
    message,
    status: 404,
    code: 'NOT_FOUND',
  });

  return {
    status: error.status,
    error: error.toJSON(),
  };
}

/**
 * Create an unauthorized error response
 */
export function createUnauthorizedError(message = 'Unauthorized') {
  const error = new ApiError({
    message,
    status: 401,
    code: 'UNAUTHORIZED',
  });

  return {
    status: error.status,
    error: error.toJSON(),
  };
}

/**
 * Create a forbidden error response
 */
export function createForbiddenError(message = 'Forbidden') {
  const error = new ApiError({
    message,
    status: 403,
    code: 'FORBIDDEN',
  });

  return {
    status: error.status,
    error: error.toJSON(),
  };
}

/**
 * Create a conflict error response
 */
export function createConflictError(message = 'Conflict', details?: any) {
  const error = new ApiError({
    message,
    status: 409,
    code: 'CONFLICT',
    details,
  });

  return {
    status: error.status,
    error: error.toJSON(),
  };
}
