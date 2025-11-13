import { NextResponse } from "next/server";
import { getInquiryById, updateInquiry, deleteInquiry } from "@/lib/admin/data-store";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const inquiry = getInquiryById(params.id);
    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }
    return NextResponse.json(inquiry);
  } catch (error) {
    console.error("Error fetching inquiry:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiry" },
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
    const inquiry = updateInquiry(params.id, body);
    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }
    return NextResponse.json(inquiry);
  } catch (error) {
    console.error("Error updating inquiry:", error);
    return NextResponse.json(
      { error: "Failed to update inquiry" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const success = deleteInquiry(params.id);
    if (!success) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    return NextResponse.json(
      { error: "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}
