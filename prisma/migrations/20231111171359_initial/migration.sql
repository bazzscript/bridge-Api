/*
  Warnings:

  - Added the required column `landLordId` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "landLordId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_landLordId_fkey" FOREIGN KEY ("landLordId") REFERENCES "LandLord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
