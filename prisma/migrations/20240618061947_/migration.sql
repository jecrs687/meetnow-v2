/*
  Warnings:

  - The `role` column on the `Participant` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "ParticipantRole" AS ENUM ('OWNER', 'GUEST');

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "role",
ADD COLUMN     "role" "ParticipantRole" NOT NULL DEFAULT 'GUEST';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "actived_at" TIMESTAMP(3),
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER',
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- DropEnum
DROP TYPE "Role";
