import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT: Update inquiry status and notes
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const inquiryId = params.id;
    const body = await request.json();
    // TODO: Get userId from session
    const userId = "test-agent-id"; // Placeholder

    const existingInquiry = await prisma.inquiry.findUnique({
      where: { id: inquiryId },
    });

    if (!existingInquiry) {
      return NextResponse.json(
        { message: "Inquiry not found" },
        { status: 404 }
      );
    }

    if (existingInquiry.agentId !== userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    const updatedInquiry = await prisma.inquiry.update({
      where: { id: inquiryId },
      data: {
        status: body.status || existingInquiry.status,
        notes: body.notes !== undefined ? body.notes : existingInquiry.notes,
      },
    });

    return NextResponse.json(updatedInquiry);
  } catch (error) {
    console.error("Error updating inquiry:", error);
    return NextResponse.json(
      { message: "Failed to update inquiry" },
      { status: 500 }
    );
  }
}

// DELETE: Delete inquiry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const inquiryId = params.id;
    // TODO: Get userId from session
    const userId = "test-agent-id"; // Placeholder

    const existingInquiry = await prisma.inquiry.findUnique({
      where: { id: inquiryId },
    });

    if (!existingInquiry) {
      return NextResponse.json(
        { message: "Inquiry not found" },
        { status: 404 }
      );
    }

    if (existingInquiry.agentId !== userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    await prisma.inquiry.delete({
      where: { id: inquiryId },
    });

    return NextResponse.json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    return NextResponse.json(
      { message: "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}
