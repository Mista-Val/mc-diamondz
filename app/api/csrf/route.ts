import { getCsrfTokenResponse } from '@/lib/security/csrf';

export function GET() {
  return getCsrfTokenResponse();
}

export const dynamic = 'force-dynamic';
