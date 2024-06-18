/*
  Warnings:

  - You are about to drop the column `actived_at` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "actived_at",
ADD COLUMN     "activated_at" TIMESTAMP(3);
