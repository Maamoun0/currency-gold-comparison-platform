import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  try {
    const history = await query(`
      SELECT 
        recorded_at as date,
        buy_price as price
      FROM price_history ph
      JOIN currencies c ON ph.currency_id = c.id
      WHERE c.code = $1
      ORDER BY recorded_at ASC
      LIMIT 100
    `, [code.toUpperCase()]);

    // Format date for chart
    const formattedData = history.rows.map(row => ({
      ...row,
      date: new Date(row.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}
