import { NextResponse } from "next/server";
import { banUser } from "@/lib/admin/data-store";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = banUser(params.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error banning user:", error);
    return NextResponse.json(
      { error: "Failed to ban user" },
      { status: 500 }
    );
  }
}
