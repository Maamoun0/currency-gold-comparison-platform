import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const goldPrices = await query(`
      SELECT 
        p.buy_price, 
        p.sell_price, 
        p.last_updated,
        c.code,
        c.name_ar as gold_name
      FROM prices p
      JOIN currencies c ON p.currency_id = c.id
      WHERE c.type = 'gold'
      ORDER BY c.code DESC
    `);
    return NextResponse.json(goldPrices.rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch gold prices" }, { status: 500 });
  }
}
