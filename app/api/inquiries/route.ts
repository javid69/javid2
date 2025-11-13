import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { propertyId, name, email, phone, message } = body;

    if (!propertyId || !name || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    console.log("Inquiry received:", {
      propertyId,
      name,
      email,
      phone,
      message,
    });

    return NextResponse.json({
      success: true,
      message: "Inquiry sent successfully. An agent will contact you soon.",
    });
  } catch (error) {
    console.error("Error submitting inquiry:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 },
    );
  }
}
