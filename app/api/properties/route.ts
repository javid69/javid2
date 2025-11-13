import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({ 
      properties: [],
      message: "This endpoint will return all properties" 
    });
  } catch (error) {
    console.error("Properties fetch error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "AGENT" && session.user.role !== "ADMIN") {
      return NextResponse.json({ 
        error: "Only agents and admins can create properties" 
      }, { status: 403 });
    }

    const body = await req.json();

    return NextResponse.json(
      { 
        message: "Property created successfully",
        property: { id: "mock-id", ...body, userId: session.user.id }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Property creation error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
