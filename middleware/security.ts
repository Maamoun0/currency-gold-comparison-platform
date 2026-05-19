import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rateLimitMap = new Map();

export function rateLimit(ip: string) {
  const now = Date.now();
  const windowSize = 60 * 1000; // 1 minute
  const maxRequests = 60; // 60 requests per minute

  const userRequests = rateLimitMap.get(ip) || [];
  const recentRequests = userRequests.filter((timestamp: number) => now - timestamp < windowSize);
  
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);

  return recentRequests.length <= maxRequests;
}

export async function securityMiddleware(req: NextRequest) {
  const ip = (req as any).ip || req.headers.get("x-forwarded-for") || "127.0.0.1";
  
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const res = NextResponse.next();
  
  // Security Headers
  res.headers.set("X-DNS-Prefetch-Control", "on");
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "origin-when-cross-origin");

  return res;
}
