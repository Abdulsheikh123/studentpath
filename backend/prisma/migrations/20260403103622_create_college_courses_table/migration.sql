-- CreateTable
CREATE TABLE "college_courses" (
    "id" SERIAL NOT NULL,
    "fees" DOUBLE PRECISION,
    "feesType" TEXT,
    "seats" INTEGER,
    "admissionMode" TEXT,
    "collegeId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "college_courses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "college_courses" ADD CONSTRAINT "college_courses_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "college_courses" ADD CONSTRAINT "college_courses_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
