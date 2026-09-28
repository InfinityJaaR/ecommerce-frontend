import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const metric = await request.json() as { id?: unknown; name?: unknown; value?: unknown; rating?: unknown; path?: unknown };
    if (typeof metric.name !== "string" || typeof metric.value !== "number") return new NextResponse(null, { status: 400 });
    if (process.env.NODE_ENV !== "production") {
      console.info("[web-vitals]", {
        name: metric.name,
        value: Math.round(metric.value * 100) / 100,
        rating: typeof metric.rating === "string" ? metric.rating : "unknown",
        path: typeof metric.path === "string" ? metric.path : "/",
      });
    }
    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 400 });
  }
}
