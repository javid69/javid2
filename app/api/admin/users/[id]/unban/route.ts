import { NextResponse } from "next/server";
import { unbanUser } from "@/lib/admin/data-store";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = unbanUser(params.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error unbanning user:", error);
    return NextResponse.json(
      { error: "Failed to unban user" },
      { status: 500 }
    );
  }
}
