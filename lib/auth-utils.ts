import { auth } from "./auth";
import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

export async function requireAuth() {
  const session = await auth();
  
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  
  return session.user;
}

export async function requireRole(role: UserRole) {
  const user = await requireAuth();
  
  if (user.role !== role && user.role !== UserRole.ADMIN) {
    throw new Error("Forbidden");
  }
  
  return user;
}

export async function isAdmin() {
  const session = await auth();
  return session?.user?.role === UserRole.ADMIN;
}

export async function isAgent() {
  const session = await auth();
  return session?.user?.role === UserRole.AGENT || session?.user?.role === UserRole.ADMIN;
}

export async function checkAuth(req: NextRequest) {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  return { user: session.user };
}

export async function checkRole(req: NextRequest, requiredRole: UserRole) {
  const result = await checkAuth(req);
  
  if (result instanceof NextResponse) {
    return result;
  }
  
  const { user } = result;
  
  if (user.role !== requiredRole && user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  return { user };
}
