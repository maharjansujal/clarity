import { pool } from "@/lib/db";
import { hash } from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Check if user exists
    const res = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (res.rows.length > 0) {
      return new Response(
        JSON.stringify({ message: "Email already registered" }),
        { status: 400 }
      );
    }

    // Hash password & insert user
    const hashed = await hash(password, 10);
    await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [
      email,
      hashed,
    ]);

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}
