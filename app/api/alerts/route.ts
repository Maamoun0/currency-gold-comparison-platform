import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { currencyId, targetPrice, condition } = await request.json();

    const result = await query(
      `INSERT INTO alerts (user_id, currency_id, target_price, condition) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [session.user.id, currencyId, targetPrice, condition]
    );

    return NextResponse.json({ id: result.rows[0].id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const alerts = await query(
      `SELECT a.*, c.code, c.name_ar 
       FROM alerts a 
       JOIN currencies c ON a.currency_id = c.id 
       WHERE a.user_id = $1`,
      [session.user.id]
    );
    return NextResponse.json(alerts.rows);
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
