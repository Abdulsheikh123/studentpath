-- CreateTable
CREATE TABLE "school_admissions" (
    "id" SERIAL NOT NULL,
    "admissionClass" TEXT,
    "examName" TEXT,
    "eligibility" TEXT,
    "ageLimit" TEXT,
    "formStartDate" TIMESTAMP(3),
    "formEndDate" TIMESTAMP(3),
    "examDate" TIMESTAMP(3),
    "schoolId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "school_admissions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "school_admissions" ADD CONSTRAINT "school_admissions_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
