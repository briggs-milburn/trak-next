/*
  Warnings:

  - You are about to drop the `UsersOnTokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UsersOnTokens" DROP CONSTRAINT "UsersOnTokens_tokenId_fkey";

-- DropForeignKey
ALTER TABLE "UsersOnTokens" DROP CONSTRAINT "UsersOnTokens_userId_fkey";

-- DropTable
DROP TABLE "UsersOnTokens";

-- CreateTable
CREATE TABLE "TokensOnUsers" (
    "userId" INTEGER NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokensOnUsers_pkey" PRIMARY KEY ("userId","tokenId")
);

-- AddForeignKey
ALTER TABLE "TokensOnUsers" ADD CONSTRAINT "TokensOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokensOnUsers" ADD CONSTRAINT "TokensOnUsers_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
