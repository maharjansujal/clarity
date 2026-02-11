import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { hash } from "bcrypt";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const hashedPassword = await hash(password, 10);

  const client = await pool.connect();
  try {
    const result = await client.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword]
    );
    const user = result.rows[0];
    return NextResponse.json({ user });
  } catch (error: any) {
    if (error.code === "23505") { // unique_violation
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    client.release();
  }
}
