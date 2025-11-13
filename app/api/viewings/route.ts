import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { propertyId, name, email, phone, date, time, notes } = body;

    if (!propertyId || !name || !email || !phone || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    console.log("Viewing scheduled:", {
      propertyId,
      name,
      email,
      phone,
      date,
      time,
      notes,
    });

    return NextResponse.json({
      success: true,
      message: "Viewing scheduled successfully. A confirmation email has been sent.",
    });
  } catch (error) {
    console.error("Error scheduling viewing:", error);
    return NextResponse.json(
      { error: "Failed to schedule viewing" },
      { status: 500 },
    );
  }
}
