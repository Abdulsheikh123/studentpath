-- CreateTable
CREATE TABLE "exam_cities" (
    "id" SERIAL NOT NULL,
    "examId" INTEGER NOT NULL,
    "cityId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exam_cities_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "exam_cities" ADD CONSTRAINT "exam_cities_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_cities" ADD CONSTRAINT "exam_cities_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
