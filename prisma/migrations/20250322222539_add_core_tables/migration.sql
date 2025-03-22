-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('APPROVED', 'REFUSED', 'PENDING');

-- CreateTable
CREATE TABLE "Building" (
    "public_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,

    CONSTRAINT "Building_pkey" PRIMARY KEY ("public_id")
);

-- CreateTable
CREATE TABLE "Tower" (
    "public_id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "building_id" TEXT NOT NULL,

    CONSTRAINT "Tower_pkey" PRIMARY KEY ("public_id")
);

-- CreateTable
CREATE TABLE "Apartment" (
    "public_id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "tower_id" TEXT NOT NULL,

    CONSTRAINT "Apartment_pkey" PRIMARY KEY ("public_id")
);

-- CreateTable
CREATE TABLE "User" (
    "public_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "apartment_id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("public_id")
);

-- CreateTable
CREATE TABLE "ParkingSpace" (
    "public_id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "guidance" TEXT NOT NULL,
    "is_covered" BOOLEAN NOT NULL,
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "apartment_id" TEXT NOT NULL,

    CONSTRAINT "ParkingSpace_pkey" PRIMARY KEY ("public_id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "public_id" TEXT NOT NULL,
    "claimant_id" TEXT NOT NULL,
    "parking_space_id" TEXT NOT NULL,
    "booked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "booked_from" TIMESTAMP(3) NOT NULL,
    "booked_to" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("public_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Building_public_id_key" ON "Building"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "Building_cnpj_key" ON "Building"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Tower_public_id_key" ON "Tower"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "Apartment_public_id_key" ON "Apartment"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_public_id_key" ON "User"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ParkingSpace_public_id_key" ON "ParkingSpace"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_public_id_key" ON "Booking"("public_id");

-- AddForeignKey
ALTER TABLE "Tower" ADD CONSTRAINT "Tower_building_id_fkey" FOREIGN KEY ("building_id") REFERENCES "Building"("public_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apartment" ADD CONSTRAINT "Apartment_tower_id_fkey" FOREIGN KEY ("tower_id") REFERENCES "Tower"("public_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_apartment_id_fkey" FOREIGN KEY ("apartment_id") REFERENCES "Apartment"("public_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParkingSpace" ADD CONSTRAINT "ParkingSpace_apartment_id_fkey" FOREIGN KEY ("apartment_id") REFERENCES "Apartment"("public_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_claimant_id_fkey" FOREIGN KEY ("claimant_id") REFERENCES "User"("public_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_parking_space_id_fkey" FOREIGN KEY ("parking_space_id") REFERENCES "ParkingSpace"("public_id") ON DELETE RESTRICT ON UPDATE CASCADE;
