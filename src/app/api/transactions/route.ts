import { pool } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const user_id = session.user.id;
  try {
    const result = await pool.query(
      "SELECT * FROM transactions WHERE user_id = $1",
      [user_id],
    );
    return NextResponse.json({ transactions: result.rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error in fetching transactions" },
      { status: 400 },
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user_id = session?.user?.id;
  try {
    const { type, amount, category, description, title, date } = await req.json();
    if (!type || !amount || !category || !date || !title) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }
    await pool.query(
      `INSERT INTO transactions 
   (user_id, type, amount, category, description, title, date) 
   VALUES ($1, $2, $3, $4, $5, $6)`,
      [user_id, type, amount, category, description, title, date],
    );
    return new NextResponse(JSON.stringify({ success: true }), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
