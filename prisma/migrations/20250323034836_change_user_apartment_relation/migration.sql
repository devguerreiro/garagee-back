/*
  Warnings:

  - A unique constraint covering the columns `[apartment_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_apartment_id_key" ON "User"("apartment_id");
