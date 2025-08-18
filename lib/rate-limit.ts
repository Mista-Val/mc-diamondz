import { LRUCache } from 'lru-cache';
import { NextResponse } from 'next/server';

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache<string, number[]>({
    max: options?.uniqueTokenPerInterval || 500, // Max 500 unique IPs per interval
    ttl: options?.interval || 60 * 1000, // 1 minute by default
  });

  return {
    check: (req: Request, limit: number, token: string) => {
      const tokenCount = tokenCache.get(token) || [0];
      if (tokenCount[0] === 0) {
        tokenCache.set(token, tokenCount);
      }
      tokenCount[0] += 1;

      const currentUsage = tokenCount[0];
      const isRateLimited = currentUsage > limit;

      const headers = {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': isRateLimited ? '0' : (limit - currentUsage).toString(),
      };

      if (isRateLimited) {
        return {
          headers,
          status: 429,
          body: { error: 'Too many requests' },
        };
      }

      return {
        headers,
        status: 200,
      };
    },
  };
}

// Rate limit configuration
const limiter = rateLimit({
  uniqueTokenPerInterval: 500, // Max 500 users per interval
  interval: 60000, // 1 minute
});

export async function applyRateLimit(req: Request, limit = 10) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
  const result = limiter.check(req, limit, ip);

  if (result.status === 429) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { 
        status: 429,
        headers: result.headers as Record<string, string>
      }
    );
  }

  return null; // No rate limit exceeded
}
