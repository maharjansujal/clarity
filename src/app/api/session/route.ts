import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() { // returns JSON with current session info
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ loggedIn: false }, { status: 200 });
  }

  return NextResponse.json({ loggedIn: true, user: session.user });
}
