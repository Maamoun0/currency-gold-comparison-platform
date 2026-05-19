import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const banks = await query("SELECT * FROM banks ORDER BY name_ar ASC");
    return NextResponse.json(banks.rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch banks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
    // Admin check would go here (omitted for brevity in this step)
    try {
        const { slug, name_ar, name_en, logo_url, website_url } = await request.json();
        const result = await query(
            "INSERT INTO banks (slug, name_ar, name_en, logo_url, website_url) VALUES ($1, $2, $3, $4, $5) RETURNING id",
            [slug, name_ar, name_en, logo_url, website_url]
        );
        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create bank" }, { status: 500 });
    }
}
