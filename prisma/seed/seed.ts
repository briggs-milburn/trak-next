import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // hash password for seeding
  const hashedPassword = await bcrypt.hash("password123", 10);
  // Upsert User
  await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {
      password: hashedPassword,
      isActive: true,
    },
    create: {
      email: "user@example.com",
      password: hashedPassword,
      isActive: true,
      profile: {
        create: {
          firstName: "John",
          lastName: "Doe",
          avatarUrl: null,
        },
      },
    },
    include: { profile: true },
  });

  // Upsert Profile
  await prisma.profile.upsert({
    where: { userId: 1 },
    update: { firstName: "John", lastName: "Doe" },
    create: {
      userId: 1,
      firstName: "John",
      lastName: "Doe",
      avatarUrl: null,
    },
  });

  // Upsert multiple tokens for the user and seed random locations for each
  const tokenCount = 3;
  const userId = 1;
  for (let t = 0; t < tokenCount; t++) {
    const tokenIdStr = `token-${t + 1}`;
    // Upsert token
    const token = await prisma.token.upsert({
      where: { tokenId: tokenIdStr },
      update: {},
      create: {
        tokenId: tokenIdStr,
      },
    });

    // Link token to user
    await prisma.tokensOnUsers.upsert({
      where: { userId_tokenId: { userId, tokenId: token.id } },
      update: {},
      create: {
        userId,
        tokenId: token.id,
      },
    });

    // Seed random number of locations (3-6) for this token
    const locationCount = Math.floor(Math.random() * 4) + 3;
    for (let l = 0; l < locationCount; l++) {
      const latitude = 30 + Math.random() * 20;
      const longitude = -130 + Math.random() * 60;
      await prisma.location.create({
        data: {
          tokenId: token.id,
          latitude,
          longitude,
        },
      });
    }
  }

  // Upsert TokensOnUsers
  await prisma.tokensOnUsers.upsert({
    where: { userId_tokenId: { userId: 1, tokenId: 1 } },
    update: {},
    create: {
      userId: 1,
      tokenId: 1,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
