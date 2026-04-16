/*
  Warnings:

  - You are about to drop the `college_courses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `college_exams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `college_placements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `colleges` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "college_courses" DROP CONSTRAINT "college_courses_collegeId_fkey";

-- DropForeignKey
ALTER TABLE "college_courses" DROP CONSTRAINT "college_courses_courseId_fkey";

-- DropForeignKey
ALTER TABLE "college_exams" DROP CONSTRAINT "college_exams_collegeId_fkey";

-- DropForeignKey
ALTER TABLE "college_exams" DROP CONSTRAINT "college_exams_courseId_fkey";

-- DropForeignKey
ALTER TABLE "college_exams" DROP CONSTRAINT "college_exams_examId_fkey";

-- DropForeignKey
ALTER TABLE "college_placements" DROP CONSTRAINT "college_placements_collegeId_fkey";

-- DropForeignKey
ALTER TABLE "colleges" DROP CONSTRAINT "colleges_categoryId_fkey";

-- DropTable
DROP TABLE "college_courses";

-- DropTable
DROP TABLE "college_exams";

-- DropTable
DROP TABLE "college_placements";

-- DropTable
DROP TABLE "colleges";
