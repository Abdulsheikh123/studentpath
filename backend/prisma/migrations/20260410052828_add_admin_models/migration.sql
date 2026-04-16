-- CreateTable
CREATE TABLE "super_admins" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "super_admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institution_admins" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "googleId" TEXT,
    "mobile" TEXT,
    "institutionTitle" TEXT NOT NULL,
    "institutionType" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "universityId" INTEGER,
    "collegeId" INTEGER,
    "schoolId" INTEGER,
    "instituteId" INTEGER,
    "researchId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institution_admins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "super_admins_email_key" ON "super_admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "institution_admins_username_key" ON "institution_admins"("username");

-- CreateIndex
CREATE UNIQUE INDEX "institution_admins_email_key" ON "institution_admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "institution_admins_googleId_key" ON "institution_admins"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "institution_admins_universityId_key" ON "institution_admins"("universityId");

-- CreateIndex
CREATE UNIQUE INDEX "institution_admins_collegeId_key" ON "institution_admins"("collegeId");

-- CreateIndex
CREATE UNIQUE INDEX "institution_admins_schoolId_key" ON "institution_admins"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "institution_admins_instituteId_key" ON "institution_admins"("instituteId");

-- CreateIndex
CREATE UNIQUE INDEX "institution_admins_researchId_key" ON "institution_admins"("researchId");

-- AddForeignKey
ALTER TABLE "institution_admins" ADD CONSTRAINT "institution_admins_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_admins" ADD CONSTRAINT "institution_admins_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_admins" ADD CONSTRAINT "institution_admins_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_admins" ADD CONSTRAINT "institution_admins_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "standalone_institutes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_admins" ADD CONSTRAINT "institution_admins_researchId_fkey" FOREIGN KEY ("researchId") REFERENCES "research_institutes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
