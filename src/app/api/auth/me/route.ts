import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/auth_token=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        tokens: {
          select: {
            token: {
              select: {
                id: true,
                tokenId: true,
                locations: {
                  select: {
                    id: true,
                    latitude: true,
                    longitude: true,
                    timestamp: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Flatten tokens and locations for easier frontend use
    // Type-safe flattening
    const tokens = (user.tokens ?? []).map((t) => t.token);
    const locations = tokens.flatMap((token) =>
      (token.locations ?? []).map((loc) => ({
        id: loc.id,
        tokenId: token.tokenId,
        latitude: loc.latitude,
        longitude: loc.longitude,
        timestamp: loc.timestamp,
      }))
    );

    return NextResponse.json({ user: { ...user, tokens, locations } });
  } catch {
    return NextResponse.json({ user: null });
  }
}
