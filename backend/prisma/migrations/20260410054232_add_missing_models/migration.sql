-- CreateTable
CREATE TABLE "university_courses" (
    "id" SERIAL NOT NULL,
    "fees" DOUBLE PRECISION,
    "seats" INTEGER,
    "duration" TEXT,
    "mode" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "universityId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "university_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "college_courses" (
    "id" SERIAL NOT NULL,
    "fees" DOUBLE PRECISION,
    "seats" INTEGER,
    "duration" TEXT,
    "mode" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "collegeId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "college_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institute_courses" (
    "id" SERIAL NOT NULL,
    "fees" DOUBLE PRECISION,
    "seats" INTEGER,
    "duration" TEXT,
    "mode" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "instituteId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institute_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_courses" (
    "id" SERIAL NOT NULL,
    "fees" DOUBLE PRECISION,
    "seats" INTEGER,
    "duration" TEXT,
    "mode" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "researchId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "university_placements" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "totalStudents" INTEGER,
    "placedStudents" INTEGER,
    "placementPercent" DOUBLE PRECISION,
    "avgPackage" DOUBLE PRECISION,
    "highestPackage" DOUBLE PRECISION,
    "topRecruiters" TEXT,
    "description" TEXT,
    "universityId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "university_placements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "college_placements" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "totalStudents" INTEGER,
    "placedStudents" INTEGER,
    "placementPercent" DOUBLE PRECISION,
    "avgPackage" DOUBLE PRECISION,
    "highestPackage" DOUBLE PRECISION,
    "topRecruiters" TEXT,
    "description" TEXT,
    "collegeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "college_placements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institute_placements" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "totalStudents" INTEGER,
    "placedStudents" INTEGER,
    "placementPercent" DOUBLE PRECISION,
    "avgPackage" DOUBLE PRECISION,
    "highestPackage" DOUBLE PRECISION,
    "topRecruiters" TEXT,
    "description" TEXT,
    "instituteId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institute_placements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_placements" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "totalStudents" INTEGER,
    "placedStudents" INTEGER,
    "placementPercent" DOUBLE PRECISION,
    "avgPackage" DOUBLE PRECISION,
    "highestPackage" DOUBLE PRECISION,
    "topRecruiters" TEXT,
    "description" TEXT,
    "researchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_placements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "university_admissions" (
    "id" SERIAL NOT NULL,
    "courseName" TEXT,
    "admissionType" TEXT,
    "eligibility" TEXT,
    "formStartDate" TIMESTAMP(3),
    "formEndDate" TIMESTAMP(3),
    "admissionDate" TIMESTAMP(3),
    "fees" DOUBLE PRECISION,
    "seats" INTEGER,
    "description" TEXT,
    "universityId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "university_admissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "college_admissions" (
    "id" SERIAL NOT NULL,
    "courseName" TEXT,
    "admissionType" TEXT,
    "eligibility" TEXT,
    "formStartDate" TIMESTAMP(3),
    "formEndDate" TIMESTAMP(3),
    "admissionDate" TIMESTAMP(3),
    "fees" DOUBLE PRECISION,
    "seats" INTEGER,
    "description" TEXT,
    "collegeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "college_admissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institute_admissions" (
    "id" SERIAL NOT NULL,
    "courseName" TEXT,
    "admissionType" TEXT,
    "eligibility" TEXT,
    "formStartDate" TIMESTAMP(3),
    "formEndDate" TIMESTAMP(3),
    "admissionDate" TIMESTAMP(3),
    "fees" DOUBLE PRECISION,
    "seats" INTEGER,
    "description" TEXT,
    "instituteId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institute_admissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_admission_details" (
    "id" SERIAL NOT NULL,
    "courseName" TEXT,
    "admissionType" TEXT,
    "eligibility" TEXT,
    "formStartDate" TIMESTAMP(3),
    "formEndDate" TIMESTAMP(3),
    "admissionDate" TIMESTAMP(3),
    "fees" DOUBLE PRECISION,
    "seats" INTEGER,
    "description" TEXT,
    "schoolId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "school_admission_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_admissions" (
    "id" SERIAL NOT NULL,
    "courseName" TEXT,
    "admissionType" TEXT,
    "eligibility" TEXT,
    "formStartDate" TIMESTAMP(3),
    "formEndDate" TIMESTAMP(3),
    "admissionDate" TIMESTAMP(3),
    "fees" DOUBLE PRECISION,
    "seats" INTEGER,
    "description" TEXT,
    "researchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_admissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "university_gallery" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "type" TEXT,
    "universityId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "university_gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "college_gallery" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "type" TEXT,
    "collegeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "college_gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institute_gallery" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "type" TEXT,
    "instituteId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "institute_gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_gallery" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "type" TEXT,
    "schoolId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "school_gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_gallery" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "type" TEXT,
    "researchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "research_gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "university_rankings" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "rankingBody" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "score" DOUBLE PRECISION,
    "description" TEXT,
    "universityId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "university_rankings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "college_rankings" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "rankingBody" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "score" DOUBLE PRECISION,
    "description" TEXT,
    "collegeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "college_rankings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "university_courses_universityId_courseId_key" ON "university_courses"("universityId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "college_courses_collegeId_courseId_key" ON "college_courses"("collegeId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "institute_courses_instituteId_courseId_key" ON "institute_courses"("instituteId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "research_courses_researchId_courseId_key" ON "research_courses"("researchId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "university_placements_universityId_year_key" ON "university_placements"("universityId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "college_placements_collegeId_year_key" ON "college_placements"("collegeId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "institute_placements_instituteId_year_key" ON "institute_placements"("instituteId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "research_placements_researchId_year_key" ON "research_placements"("researchId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "university_rankings_universityId_year_rankingBody_key" ON "university_rankings"("universityId", "year", "rankingBody");

-- CreateIndex
CREATE UNIQUE INDEX "college_rankings_collegeId_year_rankingBody_key" ON "college_rankings"("collegeId", "year", "rankingBody");

-- AddForeignKey
ALTER TABLE "university_courses" ADD CONSTRAINT "university_courses_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "university_courses" ADD CONSTRAINT "university_courses_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "college_courses" ADD CONSTRAINT "college_courses_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "college_courses" ADD CONSTRAINT "college_courses_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institute_courses" ADD CONSTRAINT "institute_courses_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "standalone_institutes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institute_courses" ADD CONSTRAINT "institute_courses_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_courses" ADD CONSTRAINT "research_courses_researchId_fkey" FOREIGN KEY ("researchId") REFERENCES "research_institutes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_courses" ADD CONSTRAINT "research_courses_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "university_placements" ADD CONSTRAINT "university_placements_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "college_placements" ADD CONSTRAINT "college_placements_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institute_placements" ADD CONSTRAINT "institute_placements_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "standalone_institutes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_placements" ADD CONSTRAINT "research_placements_researchId_fkey" FOREIGN KEY ("researchId") REFERENCES "research_institutes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "university_admissions" ADD CONSTRAINT "university_admissions_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "college_admissions" ADD CONSTRAINT "college_admissions_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institute_admissions" ADD CONSTRAINT "institute_admissions_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "standalone_institutes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_admission_details" ADD CONSTRAINT "school_admission_details_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_admissions" ADD CONSTRAINT "research_admissions_researchId_fkey" FOREIGN KEY ("researchId") REFERENCES "research_institutes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "university_gallery" ADD CONSTRAINT "university_gallery_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "college_gallery" ADD CONSTRAINT "college_gallery_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institute_gallery" ADD CONSTRAINT "institute_gallery_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "standalone_institutes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_gallery" ADD CONSTRAINT "school_gallery_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_gallery" ADD CONSTRAINT "research_gallery_researchId_fkey" FOREIGN KEY ("researchId") REFERENCES "research_institutes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "university_rankings" ADD CONSTRAINT "university_rankings_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "college_rankings" ADD CONSTRAINT "college_rankings_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE;
