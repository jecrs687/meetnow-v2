/*
  Warnings:

  - You are about to drop the column `address` on the `Places` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Places` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Places` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Places` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Places` table. All the data in the column will be lost.
  - You are about to drop the column `zip` on the `Places` table. All the data in the column will be lost.
  - Added the required column `address_id` to the `Places` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lat` to the `Places` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lng` to the `Places` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Places" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "phone",
DROP COLUMN "state",
DROP COLUMN "zip",
ADD COLUMN     "address_id" TEXT NOT NULL,
ADD COLUMN     "lat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "lng" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address_id" TEXT;

-- CreateTable
CREATE TABLE "Adress" (
    "id" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "zip" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Adress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Adress"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Places" ADD CONSTRAINT "Places_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Adress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
