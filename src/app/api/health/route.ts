/**
 * GET /api/health
 * Simple health check endpoint.
 */

import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
}
