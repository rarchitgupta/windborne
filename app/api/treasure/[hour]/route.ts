import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // Avoid using the `params` object directly (Next warns it must be awaited in
  // some environments). Extract hour from the request path instead.
  const url = new URL(req.url);
  const parts = url.pathname.split("/").filter(Boolean);
  const rawHour = parts[parts.length - 1] ?? "00";
  const hh = String(rawHour).padStart(2, "0").slice(0, 2);
  const upstream = `https://a.windbornesystems.com/treasure/${hh}.json`;

  try {
    const r = await fetch(upstream);
    if (!r.ok) {
      return NextResponse.json({ error: "upstream error" }, { status: 502 });
    }
    const text = await r.text();

    // Try parse; if malformed, attempt lightweight repair (extract first top-level array)
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch (_e) {
      const first = text.indexOf("[");
      const last = text.lastIndexOf("]");
      if (first !== -1 && last !== -1 && last > first) {
        const sub = text.slice(first, last + 1);
        try {
          parsed = JSON.parse(sub);
        } catch (_e2) {
          // fall through
        }
      }
    }

    if (parsed === undefined) {
      // If parsing failed, return the raw text as-is with application/json content-type
      return new NextResponse(text, {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }

    return NextResponse.json(parsed, { status: 200 });
  } catch (_err) {
    return NextResponse.json(
      { error: "upstream fetch failed" },
      { status: 502 }
    );
  }
}
