/*
  Warnings:

  - A unique constraint covering the columns `[transactionReference]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transactionReference` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "transactionReference" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_transactionReference_key" ON "Transaction"("transactionReference");
