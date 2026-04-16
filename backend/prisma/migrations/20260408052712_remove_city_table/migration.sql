/*
  Warnings:

  - You are about to drop the column `cityId` on the `colleges` table. All the data in the column will be lost.
  - You are about to drop the column `cityId` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the `cities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `exam_cities` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "colleges" DROP CONSTRAINT "colleges_cityId_fkey";

-- DropForeignKey
ALTER TABLE "exam_cities" DROP CONSTRAINT "exam_cities_cityId_fkey";

-- DropForeignKey
ALTER TABLE "exam_cities" DROP CONSTRAINT "exam_cities_examId_fkey";

-- DropForeignKey
ALTER TABLE "schools" DROP CONSTRAINT "schools_cityId_fkey";

-- AlterTable
ALTER TABLE "colleges" DROP COLUMN "cityId";

-- AlterTable
ALTER TABLE "schools" DROP COLUMN "cityId";

-- DropTable
DROP TABLE "cities";

-- DropTable
DROP TABLE "exam_cities";
