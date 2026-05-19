import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const session = await getSession();

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const logs = await query(`
      SELECT 
        l.*, 
        b.name_ar as bank_name 
      FROM scraper_logs l
      LEFT JOIN banks b ON l.bank_id = b.id
      ORDER BY l.created_at DESC 
      LIMIT 50
    `);

    return NextResponse.json(logs.rows);
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
