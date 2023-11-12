-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "sold" BOOLEAN,
ADD COLUMN     "soldPrice" DECIMAL(32,2) NOT NULL DEFAULT 0;
