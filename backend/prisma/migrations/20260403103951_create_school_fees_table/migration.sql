-- CreateTable
CREATE TABLE "school_fees" (
    "id" SERIAL NOT NULL,
    "className" TEXT NOT NULL,
    "admissionFee" DOUBLE PRECISION,
    "tuitionFee" DOUBLE PRECISION,
    "annualFee" DOUBLE PRECISION,
    "hostelFee" DOUBLE PRECISION,
    "transportFee" DOUBLE PRECISION,
    "feesType" TEXT,
    "schoolId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "school_fees_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "school_fees" ADD CONSTRAINT "school_fees_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
