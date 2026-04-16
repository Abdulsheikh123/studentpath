/*
  Warnings:

  - You are about to drop the column `fee` on the `exam_fees` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[examId,categoryName,year]` on the table `exam_fees` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `applicationFee` to the `exam_fees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalFee` to the `exam_fees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `exam_fees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "exam_fees" DROP COLUMN "fee",
ADD COLUMN     "applicationFee" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "correctionFee" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "lateFee" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "totalFee" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "exam_fees_examId_categoryName_year_key" ON "exam_fees"("examId", "categoryName", "year");
