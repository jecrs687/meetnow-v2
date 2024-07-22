/*
  Warnings:

  - You are about to drop the column `forwardFromid` on the `Message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_forwardFromid_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "forwardFromid",
ADD COLUMN     "forwardFromId" TEXT;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_forwardFromId_fkey" FOREIGN KEY ("forwardFromId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
