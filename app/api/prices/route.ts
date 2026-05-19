import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const prices = await query(`
      SELECT 
        p.buy_price, 
        p.sell_price, 
        p.last_updated,
        b.name_ar as bank_name,
        b.logo_url as bank_logo,
        c.code as currency_code,
        c.name_ar as currency_name
      FROM prices p
      JOIN banks b ON p.bank_id = b.id
      JOIN currencies c ON p.currency_id = c.id
      ORDER BY p.last_updated DESC
    `);

    return NextResponse.json(prices.rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 500 });
  }
}
