/*
  Warnings:

  - You are about to drop the `College` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `District` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PMVidyalaxmiInstitute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResearchInstitute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StandaloneInstitute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubDistrict` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `University` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `admins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `admission_guides` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `faqs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hostels` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ratings` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `subDistrictId` to the `schools` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "College" DROP CONSTRAINT "College_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "College" DROP CONSTRAINT "College_districtId_fkey";

-- DropForeignKey
ALTER TABLE "College" DROP CONSTRAINT "College_stateId_fkey";

-- DropForeignKey
ALTER TABLE "College" DROP CONSTRAINT "College_subDistrictId_fkey";

-- DropForeignKey
ALTER TABLE "District" DROP CONSTRAINT "District_stateId_fkey";

-- DropForeignKey
ALTER TABLE "PMVidyalaxmiInstitute" DROP CONSTRAINT "PMVidyalaxmiInstitute_districtId_fkey";

-- DropForeignKey
ALTER TABLE "PMVidyalaxmiInstitute" DROP CONSTRAINT "PMVidyalaxmiInstitute_stateId_fkey";

-- DropForeignKey
ALTER TABLE "PMVidyalaxmiInstitute" DROP CONSTRAINT "PMVidyalaxmiInstitute_subDistrictId_fkey";

-- DropForeignKey
ALTER TABLE "ResearchInstitute" DROP CONSTRAINT "ResearchInstitute_districtId_fkey";

-- DropForeignKey
ALTER TABLE "ResearchInstitute" DROP CONSTRAINT "ResearchInstitute_stateId_fkey";

-- DropForeignKey
ALTER TABLE "ResearchInstitute" DROP CONSTRAINT "ResearchInstitute_subDistrictId_fkey";

-- DropForeignKey
ALTER TABLE "StandaloneInstitute" DROP CONSTRAINT "StandaloneInstitute_districtId_fkey";

-- DropForeignKey
ALTER TABLE "StandaloneInstitute" DROP CONSTRAINT "StandaloneInstitute_stateId_fkey";

-- DropForeignKey
ALTER TABLE "StandaloneInstitute" DROP CONSTRAINT "StandaloneInstitute_subDistrictId_fkey";

-- DropForeignKey
ALTER TABLE "SubDistrict" DROP CONSTRAINT "SubDistrict_districtId_fkey";

-- DropForeignKey
ALTER TABLE "University" DROP CONSTRAINT "University_districtId_fkey";

-- DropForeignKey
ALTER TABLE "University" DROP CONSTRAINT "University_stateId_fkey";

-- DropForeignKey
ALTER TABLE "University" DROP CONSTRAINT "University_subDistrictId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_userId_fkey";

-- DropForeignKey
ALTER TABLE "exam_dates" DROP CONSTRAINT "exam_dates_examId_fkey";

-- DropForeignKey
ALTER TABLE "exam_eligibility" DROP CONSTRAINT "exam_eligibility_examId_fkey";

-- DropForeignKey
ALTER TABLE "exam_fees" DROP CONSTRAINT "exam_fees_examId_fkey";

-- DropForeignKey
ALTER TABLE "exam_pattern" DROP CONSTRAINT "exam_pattern_examId_fkey";

-- DropForeignKey
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_userId_fkey";

-- DropForeignKey
ALTER TABLE "school_admissions" DROP CONSTRAINT "school_admissions_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "school_fees" DROP CONSTRAINT "school_fees_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "search_history" DROP CONSTRAINT "search_history_userId_fkey";

-- AlterTable
ALTER TABLE "schools" ADD COLUMN     "subDistrictId" INTEGER NOT NULL,
ADD COLUMN     "yearOfEstablishment" INTEGER;

-- DropTable
DROP TABLE "College";

-- DropTable
DROP TABLE "District";

-- DropTable
DROP TABLE "PMVidyalaxmiInstitute";

-- DropTable
DROP TABLE "ResearchInstitute";

-- DropTable
DROP TABLE "StandaloneInstitute";

-- DropTable
DROP TABLE "SubDistrict";

-- DropTable
DROP TABLE "University";

-- DropTable
DROP TABLE "admins";

-- DropTable
DROP TABLE "admission_guides";

-- DropTable
DROP TABLE "comments";

-- DropTable
DROP TABLE "faqs";

-- DropTable
DROP TABLE "hostels";

-- DropTable
DROP TABLE "ratings";

-- CreateTable
CREATE TABLE "districts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "stateId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_districts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "districtId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sub_districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "universities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT,
    "universityType" TEXT,
    "yearOfEstablishment" INTEGER,
    "website" TEXT,
    "locationType" TEXT,
    "subDistrictId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "universities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "colleges" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT,
    "collegeType" TEXT,
    "management" TEXT,
    "locationType" TEXT,
    "website" TEXT,
    "yearOfEstablishment" INTEGER,
    "subDistrictId" INTEGER NOT NULL,
    "categoryId" INTEGER,
    "universityId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "colleges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "standalone_institutes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT,
    "instituteType" TEXT,
    "management" TEXT,
    "locationType" TEXT,
    "website" TEXT,
    "yearOfEstablishment" INTEGER,
    "subDistrictId" INTEGER NOT NULL,
    "categoryId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "standalone_institutes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_institutes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT,
    "instituteType" TEXT,
    "management" TEXT,
    "locationType" TEXT,
    "website" TEXT,
    "yearOfEstablishment" INTEGER,
    "subDistrictId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_institutes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "university_comments" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "universityId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "university_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "college_comments" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "collegeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "college_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_comments" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "schoolId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "school_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institute_comments" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "instituteId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institute_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_comments" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "researchId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "university_ratings" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "universityId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "university_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "college_ratings" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "collegeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "college_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_ratings" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "schoolId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "school_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institute_ratings" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "instituteId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "institute_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_ratings" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "researchId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "research_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "university_faqs" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "universityId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "university_faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "college_faqs" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "collegeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "college_faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_faqs" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "schoolId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "school_faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institute_faqs" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "instituteId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institute_faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_faqs" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "researchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "university_hostels" (
    "id" SERIAL NOT NULL,
    "hostelType" TEXT,
    "gender" TEXT,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "capacity" INTEGER,
    "fee" DOUBLE PRECISION,
    "facilities" TEXT,
    "image" TEXT,
    "universityId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "university_hostels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "college_hostels" (
    "id" SERIAL NOT NULL,
    "hostelType" TEXT,
    "gender" TEXT,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "capacity" INTEGER,
    "fee" DOUBLE PRECISION,
    "facilities" TEXT,
    "image" TEXT,
    "collegeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "college_hostels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institute_hostels" (
    "id" SERIAL NOT NULL,
    "hostelType" TEXT,
    "gender" TEXT,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "capacity" INTEGER,
    "fee" DOUBLE PRECISION,
    "facilities" TEXT,
    "image" TEXT,
    "instituteId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institute_hostels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_hostels" (
    "id" SERIAL NOT NULL,
    "hostelType" TEXT,
    "gender" TEXT,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "capacity" INTEGER,
    "fee" DOUBLE PRECISION,
    "facilities" TEXT,
    "image" TEXT,
    "researchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_hostels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "university_admission_guides" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "steps" TEXT NOT NULL,
    "image" TEXT,
    "universityId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "university_admission_guides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "college_admission_guides" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "steps" TEXT NOT NULL,
    "image" TEXT,
    "collegeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "college_admission_guides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institute_admission_guides" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "steps" TEXT NOT NULL,
    "image" TEXT,
    "instituteId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institute_admission_guides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_admission_guides" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "steps" TEXT NOT NULL,
    "image" TEXT,
    "researchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_admission_guides_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "districts_name_stateId_key" ON "districts"("name", "stateId");

-- CreateIndex
CREATE UNIQUE INDEX "sub_districts_name_districtId_key" ON "sub_districts"("name", "districtId");

-- CreateIndex
CREATE UNIQUE INDEX "universities_slug_key" ON "universities"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "colleges_slug_key" ON "colleges"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "standalone_institutes_slug_key" ON "standalone_institutes"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "research_institutes_slug_key" ON "research_institutes"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "university_admission_guides_slug_key" ON "university_admission_guides"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "college_admission_guides_slug_key" ON "college_admission_guides"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "institute_admission_guides_slug_key" ON "institute_admission_guides"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "research_admission_guides_slug_key" ON "research_admission_guides"("slug");

-- AddForeignKey
ALTER TABLE "districts" ADD CONSTRAINT "districts_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "states"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_districts" ADD CONSTRAINT "sub_districts_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "districts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "universities" ADD CONSTRAINT "universities_subDistrictId_fkey" FOREIGN KEY ("subDistrictId") REFERENCES "sub_districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colleges" ADD CONSTRAINT "colleges_subDistrictId_fkey" FOREIGN KEY ("subDistrictId") REFERENCES "sub_districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colleges" ADD CONSTRAINT "colleges_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colleges" ADD CONSTRAINT "colleges_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "standalone_institutes" ADD CONSTRAINT "standalone_institutes_subDistrictId_fkey" FOREIGN KEY ("subDistrictId") REFERENCES "sub_districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "standalone_institutes" ADD CONSTRAINT "standalone_institutes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_institutes" ADD CONSTRAINT "research_institutes_subDistrictId_fkey" FOREIGN KEY ("subDistrictId") REFERENCES "sub_districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schools" ADD CONSTRAINT "schools_subDistrictId_fkey" FOREIGN KEY ("subDistrictId") REFERENCES "sub_districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_admissions" ADD CONSTRAINT "school_admissions_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_fees" ADD CONSTRAINT "school_fees_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_fees" ADD CONSTRAINT "exam_fees_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_dates" ADD CONSTRAINT "exam_dates_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_eligibility" ADD CONSTRAINT "exam_eligibility_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_pattern" ADD CONSTRAINT "exam_pattern_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search_history" ADD CONSTRAINT "search_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "university_comments" ADD CONSTRAINT "university_comments_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "university_comments" ADD CONSTRAINT "university_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "college_comments" ADD CONSTRAINT "college_comments_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "college_comments" ADD CONSTRAINT "college_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_comments" ADD CONSTRAINT "school_comments_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_comments" ADD CONSTRAINT "school_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institute_comments" ADD CONSTRAINT "institute_comments_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "standalone_institutes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institute_comments" ADD CONSTRAINT "institute_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_comments" ADD CONSTRAINT "research_comments_researchId_fkey" FOREIGN KEY ("researchId") REFERENCES "research_institutes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_comments" ADD CONSTRAINT "research_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "university_ratings" ADD CONSTRAINT "university_ratings_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "university_ratings" ADD CONSTRAINT "university_ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "college_ratings" ADD CONSTRAINT "college_ratings_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "college_ratings" ADD CONSTRAINT "college_ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_ratings" ADD CONSTRAINT "school_ratings_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_ratings" ADD CONSTRAINT "school_ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institute_ratings" ADD CONSTRAINT "institute_ratings_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "standalone_institutes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institute_ratings" ADD CONSTRAINT "institute_ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_ratings" ADD CONSTRAINT "research_ratings_researchId_fkey" FOREIGN KEY ("researchId") REFERENCES "research_institutes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_ratings" ADD CONSTRAINT "research_ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "university_faqs" ADD CONSTRAINT "university_faqs_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "college_faqs" ADD CONSTRAINT "college_faqs_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_faqs" ADD CONSTRAINT "school_faqs_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institute_faqs" ADD CONSTRAINT "institute_faqs_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "standalone_institutes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_faqs" ADD CONSTRAINT "research_faqs_researchId_fkey" FOREIGN KEY ("researchId") REFERENCES "research_institutes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "university_hostels" ADD CONSTRAINT "university_hostels_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "college_hostels" ADD CONSTRAINT "college_hostels_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institute_hostels" ADD CONSTRAINT "institute_hostels_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "standalone_institutes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_hostels" ADD CONSTRAINT "research_hostels_researchId_fkey" FOREIGN KEY ("researchId") REFERENCES "research_institutes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "university_admission_guides" ADD CONSTRAINT "university_admission_guides_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "college_admission_guides" ADD CONSTRAINT "college_admission_guides_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institute_admission_guides" ADD CONSTRAINT "institute_admission_guides_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "standalone_institutes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_admission_guides" ADD CONSTRAINT "research_admission_guides_researchId_fkey" FOREIGN KEY ("researchId") REFERENCES "research_institutes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
