-- CreateTable CollegeExam
CREATE TABLE "college_exams" (
    "id" SERIAL NOT NULL,
    "collegeId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "examId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "college_exams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "college_exams_collegeId_courseId_examId_key" ON "college_exams"("collegeId", "courseId", "examId");

-- AddForeignKey
ALTER TABLE "college_exams" ADD CONSTRAINT "college_exams_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "college_exams" ADD CONSTRAINT "college_exams_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "college_exams" ADD CONSTRAINT "college_exams_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
