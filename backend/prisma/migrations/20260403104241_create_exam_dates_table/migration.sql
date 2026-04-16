-- CreateTable
CREATE TABLE "exam_dates" (
    "id" SERIAL NOT NULL,
    "session" TEXT,
    "formStartDate" TIMESTAMP(3),
    "formEndDate" TIMESTAMP(3),
    "correctionDate" TIMESTAMP(3),
    "admitCardDate" TIMESTAMP(3),
    "examDate" TIMESTAMP(3),
    "resultDate" TIMESTAMP(3),
    "examId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_dates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "exam_dates" ADD CONSTRAINT "exam_dates_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
