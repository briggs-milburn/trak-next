import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcrypt";
import { isAuthorized } from "../../auth/util";

export async function POST(req: NextRequest) {
  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Authorization
    const authResult = isAuthorized(req);
    if (authResult instanceof NextResponse) {
      return authResult; // return the error response
    }

    const user = await prisma.user.findUnique({
      where: { id: authResult.userId },
    });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Check current password
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid)
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 403 }
      );

    // Hash new password and update
    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    return NextResponse.json({ message: "Password updated" });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
