/*
  Warnings:

  - The `date` column on the `Group` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `time` column on the `Group` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3),
DROP COLUMN "time",
ADD COLUMN     "time" TIMESTAMP(3),
ALTER COLUMN "duration" DROP NOT NULL;
