-- CreateTable
CREATE TABLE "exam_eligibility" (
    "id" SERIAL NOT NULL,
    "qualification" TEXT,
    "minimumMarks" TEXT,
    "ageLimit" TEXT,
    "stream" TEXT,
    "examId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_eligibility_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "exam_eligibility" ADD CONSTRAINT "exam_eligibility_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
