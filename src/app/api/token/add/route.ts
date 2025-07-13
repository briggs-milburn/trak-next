import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { isAuthorized } from '../../auth/util';

export async function POST(req: NextRequest) {
  try {
    const { tokenId, userId = undefined } = await req.json();

    // Authorization
    const authResult = isAuthorized(req);
    if (authResult instanceof NextResponse) {
      return authResult; // return the error response
    }

    await prisma.token.create({
      data: {
        tokenId,
        users: {
          create: [
            {
              userId: userId || authResult.userId,
              assignedAt: new Date(),
            },
          ],
        },
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
