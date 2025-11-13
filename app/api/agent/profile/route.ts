import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Get agent profile
export async function GET() {
  try {
    // TODO: Get userId from session
    const userId = "test-agent-id"; // Placeholder

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        bio: true,
        agency: true,
        licenseNumber: true,
        yearsOfExp: true,
        visible: true,
        image: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { message: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// PUT: Update agent profile
export async function PUT(request: NextRequest) {
  try {
    // TODO: Get userId from session
    const userId = "test-agent-id"; // Placeholder
    const body = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        bio: body.bio,
        agency: body.agency,
        licenseNumber: body.licenseNumber,
        yearsOfExp: body.yearsOfExp,
        visible: body.visible ?? true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        bio: true,
        agency: true,
        licenseNumber: true,
        yearsOfExp: true,
        visible: true,
        image: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { message: "Failed to update profile" },
      { status: 500 }
    );
  }
}
