import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });

  response.cookies.set({
    name: "auth_token",
    value: "",
    httpOnly: true,
    expires: new Date(0),
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return response;
}
