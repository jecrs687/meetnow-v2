/*
  Warnings:

  - Made the column `lat` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lng` on table `Address` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "lat" SET NOT NULL,
ALTER COLUMN "lng" SET NOT NULL;
