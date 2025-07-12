import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { isAuthorized } from "../../auth/util";

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      firstName = undefined,
      avatarUrl = undefined,
      lastName = undefined,
    } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    // Authorization
    const authResult = isAuthorized(req);
    if (authResult instanceof NextResponse) {
      return authResult; // return the error response
    }

    // Update user in DB
    await prisma.user.update({
      where: { id: authResult.userId },
      data: { email, updatedAt: new Date() },
    });

    // Upsert profile
    // If profile exists, update it; if not, create it
    if (firstName || lastName || avatarUrl) {
      await prisma.profile.upsert({
        where: { userId: authResult.userId },
        update: { avatarUrl, firstName, lastName },
        create: { userId: authResult.userId, avatarUrl, firstName, lastName },
      });
      return NextResponse.json({ message: "Profile updated" });
    }

    return NextResponse.json({ message: "User updated" });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
