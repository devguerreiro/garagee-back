/*
  Warnings:

  - A unique constraint covering the columns `[apartment_id]` on the table `ParkingSpace` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ParkingSpace_apartment_id_key" ON "ParkingSpace"("apartment_id");
