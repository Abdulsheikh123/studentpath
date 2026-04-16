/*
  Warnings:

  - You are about to drop the column `category` on the `College` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "College" DROP COLUMN "category",
ADD COLUMN     "categoryId" INTEGER;

-- AddForeignKey
ALTER TABLE "College" ADD CONSTRAINT "College_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
