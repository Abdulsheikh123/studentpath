-- CreateTable
CREATE TABLE "exam_fees" (
    "id" SERIAL NOT NULL,
    "categoryName" TEXT NOT NULL,
    "fee" DOUBLE PRECISION NOT NULL,
    "examId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_fees_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "exam_fees" ADD CONSTRAINT "exam_fees_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
