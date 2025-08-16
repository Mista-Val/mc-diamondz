import { NextResponse } from 'next/server';

type SuccessResponse<T = any> = {
  success: true;
  data: T;
  message?: string;
};

type ErrorResponse = {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: any;
  };
};

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

/**
 * Create a successful API response
 */
export function successResponse<T = any>(
  data: T,
  message: string = 'Operation successful',
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    } as SuccessResponse<T>,
    { status }
  );
}

/**
 * Create an error API response
 */
export function errorResponse(
  message: string,
  status: number = 400,
  code?: string,
  details?: any
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code,
        details,
      },
    } as ErrorResponse,
    { status }
  );
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: unknown): NextResponse<ErrorResponse> {
  console.error('API Error:', error);
  
  if (error instanceof Error) {
    // Handle known error types
    if (error.name === 'ValidationError') {
      return errorResponse(
        'Validation Error',
        400,
        'VALIDATION_ERROR',
        (error as any).errors
      );
    }

    // Handle Prisma errors
    if (error.name.startsWith('Prisma')) {
      return errorResponse(
        'Database Error',
        500,
        'DATABASE_ERROR',
        { message: error.message }
      );
    }

    // Handle JWT errors
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return errorResponse(
        'Authentication Error',
        401,
        'AUTH_ERROR',
        { message: error.message }
      );
    }
  }

  // Fallback for unknown errors
  return errorResponse(
    'An unexpected error occurred',
    500,
    'INTERNAL_SERVER_ERROR'
  );
}

/**
 * Middleware to handle async API route handlers with consistent error handling
 */
export function apiHandler<T = any>(
  handler: (req: Request, ...args: any[]) => Promise<NextResponse<ApiResponse<T>>>>
) {
  return async (req: Request, ...args: any[]) => {
    try {
      return await handler(req, ...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

/**
 * Parse request body with proper error handling
 */
export async function parseRequestBody<T = any>(req: Request): Promise<T> {
  try {
    return await req.json();
  } catch (error) {
    throw new Error('Invalid request body');
  }
}

/**
 * Check if user has required role
 */
export function checkUserRole(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = {
    USER: 0,
    EDITOR: 1,
    ADMIN: 2,
  };

  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] ?? -1;
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] ?? -1;

  return userLevel >= requiredLevel;
}
