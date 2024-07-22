/*
  Warnings:

  - Added the required column `file_size` to the `MessageMedia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MessageMedia" ADD COLUMN     "file_size" INTEGER NOT NULL;
