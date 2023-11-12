/*
  Warnings:

  - You are about to drop the column `houseId` on the `Bid` table. All the data in the column will be lost.
  - Added the required column `propertyId` to the `Bid` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_houseId_fkey";

-- AlterTable
ALTER TABLE "Bid" DROP COLUMN "houseId",
ADD COLUMN     "propertyId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
