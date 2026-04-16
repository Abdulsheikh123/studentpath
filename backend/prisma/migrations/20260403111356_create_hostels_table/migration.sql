-- CreateTable
CREATE TABLE "hostels" (
    "id" SERIAL NOT NULL,
    "itemType" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,
    "hostelType" TEXT,
    "gender" TEXT,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "capacity" INTEGER,
    "fee" DOUBLE PRECISION,
    "facilities" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hostels_pkey" PRIMARY KEY ("id")
);
