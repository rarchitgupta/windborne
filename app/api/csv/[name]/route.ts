import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: Request, context: any) {
  try {
    const name = context.params?.name;
    if (!name || !["food", "water", "vulnerability"].includes(name)) {
      return NextResponse.json({ error: "invalid dataset" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "data", `${name}.csv`);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const content = await fs.promises.readFile(filePath, "utf8");
    return new NextResponse(content, {
      status: 200,
      headers: { "content-type": "text/csv; charset=utf-8" },
    });
  } catch (err) {
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
