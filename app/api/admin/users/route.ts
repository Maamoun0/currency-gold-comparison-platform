import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const session = await getSession();

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const users = await query(`
      SELECT id, email, full_name, role, is_verified, created_at 
      FROM users 
      ORDER BY created_at DESC
    `);

    return NextResponse.json(users.rows);
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
    const session = await getSession();
    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const { userId, role } = await request.json();
        await query("UPDATE users SET role = $1 WHERE id = $2", [role, userId]);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}
