import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string) => {
  // Password must be at least 8 characters long and contain at least one letter and one number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
};

export const isAuthorized = (req: Request) => {
  const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
  // Extract token from cookie
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/auth_token=([^;]+)/);
  const token = match ? match[1] : null;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET) as { userId: number };
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  return payload;
};
