import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export const dynamic = "force-dynamic";

type HealthResponse = {
  ok: boolean;
  app: string;
  environment: string;
  timestamp: string;
  database?: "ok" | "error";
};

export async function GET() {
  const timestamp = new Date().toISOString();
  const environment = process.env.NODE_ENV ?? "development";

  let database: "ok" | "error" = "error";

  try {
    await prisma.$queryRaw`SELECT 1`;
    database = "ok";
  } catch {
    database = "error";
  }

  const ok = database === "ok";

  const body: HealthResponse = {
    ok,
    app: "tutopt",
    environment,
    timestamp,
    database,
  };

  return NextResponse.json(body, { status: ok ? 200 : 503 });
}
