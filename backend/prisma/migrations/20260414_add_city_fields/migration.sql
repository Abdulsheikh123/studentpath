-- AlterTable
ALTER TABLE "districts" ADD COLUMN "isPopular" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "metaTitle" TEXT,
ADD COLUMN "metaDescription" TEXT;
