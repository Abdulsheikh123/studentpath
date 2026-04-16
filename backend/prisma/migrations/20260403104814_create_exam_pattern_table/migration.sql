-- CreateTable
CREATE TABLE "exam_pattern" (
    "id" SERIAL NOT NULL,
    "mode" TEXT,
    "duration" TEXT,
    "totalQuestions" INTEGER,
    "totalMarks" INTEGER,
    "negativeMarking" BOOLEAN NOT NULL DEFAULT false,
    "subjects" TEXT,
    "examId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_pattern_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "exam_pattern" ADD CONSTRAINT "exam_pattern_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
