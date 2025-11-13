import { NextResponse } from "next/server";
import { getUserById, updateUser, deleteUser } from "@/lib/admin/data-store";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserById(params.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const user = updateUser(params.id, body);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const success = deleteUser(params.id);
    if (!success) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting user:", error);
    const message = error instanceof Error ? error.message : "Failed to delete user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
