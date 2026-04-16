-- CreateTable
CREATE TABLE "University" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "universityType" TEXT,
    "yearOfEstablishment" INTEGER,
    "website" TEXT,
    "locationType" TEXT,
    "stateId" INTEGER NOT NULL,
    "districtId" INTEGER,
    "subDistrictId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "University_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "College" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "category" TEXT,
    "collegeType" TEXT,
    "management" TEXT,
    "affiliatedUniversityName" TEXT,
    "affiliatedUniversityType" TEXT,
    "locationType" TEXT,
    "website" TEXT,
    "yearOfEstablishment" INTEGER,
    "stateId" INTEGER NOT NULL,
    "districtId" INTEGER,
    "subDistrictId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "College_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandaloneInstitute" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "instituteType" TEXT,
    "management" TEXT,
    "affiliatedUniversityName" TEXT,
    "affiliatedUniversityType" TEXT,
    "locationType" TEXT,
    "website" TEXT,
    "yearOfEstablishment" INTEGER,
    "stateId" INTEGER NOT NULL,
    "districtId" INTEGER,
    "subDistrictId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StandaloneInstitute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PMVidyalaxmiInstitute" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "instituteType" TEXT,
    "management" TEXT,
    "locationType" TEXT,
    "website" TEXT,
    "yearOfEstablishment" INTEGER,
    "stateId" INTEGER NOT NULL,
    "districtId" INTEGER,
    "subDistrictId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PMVidyalaxmiInstitute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchInstitute" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "instituteType" TEXT,
    "management" TEXT,
    "locationType" TEXT,
    "website" TEXT,
    "yearOfEstablishment" INTEGER,
    "stateId" INTEGER NOT NULL,
    "districtId" INTEGER,
    "subDistrictId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResearchInstitute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "University_slug_key" ON "University"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "College_slug_key" ON "College"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "StandaloneInstitute_slug_key" ON "StandaloneInstitute"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PMVidyalaxmiInstitute_slug_key" ON "PMVidyalaxmiInstitute"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchInstitute_slug_key" ON "ResearchInstitute"("slug");

-- AddForeignKey
ALTER TABLE "University" ADD CONSTRAINT "University_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "University" ADD CONSTRAINT "University_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "University" ADD CONSTRAINT "University_subDistrictId_fkey" FOREIGN KEY ("subDistrictId") REFERENCES "SubDistrict"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "College" ADD CONSTRAINT "College_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "College" ADD CONSTRAINT "College_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "College" ADD CONSTRAINT "College_subDistrictId_fkey" FOREIGN KEY ("subDistrictId") REFERENCES "SubDistrict"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandaloneInstitute" ADD CONSTRAINT "StandaloneInstitute_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandaloneInstitute" ADD CONSTRAINT "StandaloneInstitute_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandaloneInstitute" ADD CONSTRAINT "StandaloneInstitute_subDistrictId_fkey" FOREIGN KEY ("subDistrictId") REFERENCES "SubDistrict"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PMVidyalaxmiInstitute" ADD CONSTRAINT "PMVidyalaxmiInstitute_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PMVidyalaxmiInstitute" ADD CONSTRAINT "PMVidyalaxmiInstitute_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PMVidyalaxmiInstitute" ADD CONSTRAINT "PMVidyalaxmiInstitute_subDistrictId_fkey" FOREIGN KEY ("subDistrictId") REFERENCES "SubDistrict"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchInstitute" ADD CONSTRAINT "ResearchInstitute_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchInstitute" ADD CONSTRAINT "ResearchInstitute_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchInstitute" ADD CONSTRAINT "ResearchInstitute_subDistrictId_fkey" FOREIGN KEY ("subDistrictId") REFERENCES "SubDistrict"("id") ON DELETE SET NULL ON UPDATE CASCADE;
