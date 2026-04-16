-- CreateTable
CREATE TABLE "college_placements" (
    "id" SERIAL NOT NULL,
    "highestPackage" DOUBLE PRECISION,
    "averagePackage" DOUBLE PRECISION,
    "placementPercent" DOUBLE PRECISION,
    "topRecruiters" TEXT,
    "collegeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "college_placements_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "college_placements" ADD CONSTRAINT "college_placements_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
