import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST( req: NextRequest ) {
  try {
    const { email, password } = await req.json();

    if ( !email || !password ) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique( {
      where: { email, deletedAt: null },
      include: { profile: true }
    } );
    if ( !user ) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare( password, user.password );
    if ( !valid ) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 } 
      );
    }

    const token = jwt.sign( { userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    } );

    // Set HttpOnly cookie
    const response = NextResponse.json( {
      user: {
        email: user.email ?? undefined,
        profile: user.profile ?? undefined
      },
    } );

    // Set cookie using new cookies API
    response.cookies.set( {
      name: "auth_token",
      value: token,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    } );

    return response;
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
