/*
  Warnings:

  - A unique constraint covering the columns `[name,state]` on the table `cities` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug,state]` on the table `cities` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[examId,cityId]` on the table `exam_cities` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cities_name_state_key" ON "cities"("name", "state");

-- CreateIndex
CREATE UNIQUE INDEX "cities_slug_state_key" ON "cities"("slug", "state");

-- CreateIndex
CREATE UNIQUE INDEX "exam_cities_examId_cityId_key" ON "exam_cities"("examId", "cityId");
