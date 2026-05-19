import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const stats = {
      usersCount: (await query("SELECT COUNT(*) FROM users")).rows[0].count,
      activeAlerts: (await query("SELECT COUNT(*) FROM alerts WHERE is_active = true")).rows[0].count,
      latestLogs: (await query("SELECT * FROM scraper_logs ORDER BY created_at DESC LIMIT 5")).rows[0],
      pricesCount: (await query("SELECT COUNT(*) FROM prices")).rows[0].count
    };

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
