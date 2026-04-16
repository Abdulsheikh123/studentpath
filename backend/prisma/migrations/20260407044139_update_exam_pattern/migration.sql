/*
  Warnings:

  - You are about to drop the column `subjects` on the `exam_pattern` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[examId,year]` on the table `exam_pattern` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `year` to the `exam_pattern` table without a default value. This is not possible if the table is not empty.
  - Made the column `duration` on table `exam_pattern` required. This step will fail if there are existing NULL values in that column.
  - Made the column `totalQuestions` on table `exam_pattern` required. This step will fail if there are existing NULL values in that column.
  - Made the column `totalMarks` on table `exam_pattern` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "exam_pattern" DROP COLUMN "subjects",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "sections" JSONB,
ADD COLUMN     "year" INTEGER NOT NULL,
ALTER COLUMN "duration" SET NOT NULL,
ALTER COLUMN "totalQuestions" SET NOT NULL,
ALTER COLUMN "totalMarks" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "exam_pattern_examId_year_key" ON "exam_pattern"("examId", "year");
