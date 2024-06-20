/*
  Warnings:

  - You are about to drop the column `tableId` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `number_active_tables` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Table` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `groupId` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GroupStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'CLOSED', 'HIDDEN');

-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_tableId_fkey";

-- DropForeignKey
ALTER TABLE "Table" DROP CONSTRAINT "Table_placeId_fkey";

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "tableId",
ADD COLUMN     "groupId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "number_active_tables",
ADD COLUMN     "number_active_groups" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Table";

-- DropEnum
DROP TYPE "TableStatus";

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "placeId" TEXT NOT NULL,
    "status" "GroupStatus" NOT NULL DEFAULT 'ACTIVE',
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
