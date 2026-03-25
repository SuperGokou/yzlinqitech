import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/login",
    "/register",
    "/api/orders/:path*",
    "/api/quotes/:path*",
    "/api/upload/:path*",
    "/api/auth/:path*",
  ],
};
