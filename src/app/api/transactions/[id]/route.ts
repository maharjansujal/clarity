import { pool } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const user_id = session.user.id;
  const transaction_id = params.id;

  try {
    const { type, amount, category, description, date, title } = await req.json();

    if (!type || !amount || !category || !date || !title) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await pool.query(
      `UPDATE transactions 
       SET type=$1, amount=$2, category=$3, description=$4, date=$5, title=$8 
       WHERE id=$6 AND user_id=$7`,
      [type, amount, category, description, date, transaction_id, user_id, title]
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const user_id = session.user.id;
  const transaction_id = params.id;

  try {
    await pool.query(
      "DELETE FROM transactions WHERE id=$1 AND user_id=$2",
      [transaction_id, user_id]
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
