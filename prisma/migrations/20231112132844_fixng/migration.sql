/*
  Warnings:

  - Made the column `sold` on table `Property` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Property" ALTER COLUMN "sold" SET NOT NULL,
ALTER COLUMN "sold" SET DEFAULT false;
