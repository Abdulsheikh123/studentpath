-- DropForeignKey
ALTER TABLE "universities" DROP CONSTRAINT "universities_subDistrictId_fkey";

-- AlterTable
ALTER TABLE "institution_admins" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "mobileVerified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "universities" ALTER COLUMN "subDistrictId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "institution_admin_otps" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "emailOtpHash" TEXT NOT NULL,
    "mobileOtpHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institution_admin_otps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "institution_admin_otps_email_idx" ON "institution_admin_otps"("email");

-- CreateIndex
CREATE INDEX "institution_admin_otps_mobile_idx" ON "institution_admin_otps"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "institution_admin_otps_email_mobile_key" ON "institution_admin_otps"("email", "mobile");

-- AddForeignKey
ALTER TABLE "universities" ADD CONSTRAINT "universities_subDistrictId_fkey" FOREIGN KEY ("subDistrictId") REFERENCES "sub_districts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
