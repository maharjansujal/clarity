import { pool } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  context: { params: Promise<{ transaction_id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const user_id = session.user.id;
  const { params } = context;
  const { transaction_id } = await params;

  try {
    const { type, amount, category, description, date, title } =
      await req.json();

    // Capture the result of the query
    const result = await pool.query(
      `UPDATE transactions 
       SET type=$1, amount=$2, category=$3, description=$4, date=$5, title=$6
       WHERE id=$7 AND user_id=$8
       RETURNING *`, // This returns the updated row
      [
        type,
        amount,
        category,
        description,
        date,
        title,
        transaction_id,
        user_id,
      ],
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 },
      );
    }

    // Return the actual updated transaction object
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ transaction_id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const user_id = session.user.id;
  const { params } = context;
  const { transaction_id } = await params;

  try {
    await pool.query("DELETE FROM transactions WHERE id=$1 AND user_id=$2", [
      transaction_id,
      user_id,
    ]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
