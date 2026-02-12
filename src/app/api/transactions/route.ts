import { pool } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  let query = `
    SELECT * FROM transactions 
    WHERE user_id = $1
  `;

  const values: (string | number)[] = [userId];
  let index = 2;

  if (category) {
    query += ` AND category = $${index++}`;
    values.push(category);
  }

  if (from) {
    query += ` AND date >= $${index++}`;
    values.push(from);
  }

  if (to) {
    query += ` AND date <= $${index++}`;
    values.push(to);
  }

  query += ` ORDER BY date DESC`;

  const result = await pool.query(query, values);

  return NextResponse.json({ transactions: result.rows });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user_id = session?.user?.id;
  try {
    const { type, amount, category, description, title, date } =
      await req.json();
    if (!type || !amount || !category || !date || !title) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }
    const result = await pool.query(
      `INSERT INTO transactions 
   (user_id, type, amount, category, description, title, date)
   VALUES ($1,$2,$3,$4,$5,$6,$7) 
   RETURNING *`,
      [user_id, type, amount, category, description, title, date],
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
