/*
  Warnings:

  - You are about to drop the column `name` on the `test` table. All the data in the column will be lost.
  - You are about to alter the column `firstName` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(128)`.
  - You are about to alter the column `lastName` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - Added the required column `equipmentConfigurationId` to the `test` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inclination` to the `test` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `test` table without a default value. This is not possible if the table is not empty.
  - Added the required column `softwareConfigurationId` to the `test` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SkinColor" AS ENUM ('U', 'W', 'B');

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('U', 'M', 'F');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('ES', 'EN');

-- CreateEnum
CREATE TYPE "Direction" AS ENUM ('IZQ_DER', 'DER_IZQ');

-- CreateEnum
CREATE TYPE "PatientPosition" AS ENUM ('BocaArriba', 'BocaAbajo', 'DePie', 'LateralDerecho', 'LateralIzquierdo', 'Sentado');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('Respiratorio', 'Cardiocirculatorios', 'Otros', 'Procederes', 'VentilacionMecanica', 'CambiosDeModalidadVentilatoria', 'CambiosPostulares', 'Medicamentos', 'SufractantesPulmonares', 'OtroEventoQueSeConsidereDeInteres');

-- AlterTable
ALTER TABLE "test" DROP COLUMN "name",
ADD COLUMN     "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "directory" JSONB[],
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "equipmentConfigurationId" INTEGER NOT NULL,
ADD COLUMN     "file" TEXT,
ADD COLUMN     "inclination" INTEGER NOT NULL,
ADD COLUMN     "lastModified" TIMESTAMP(3),
ADD COLUMN     "patientId" INTEGER,
ADD COLUMN     "peep" INTEGER,
ADD COLUMN     "position" "PatientPosition" NOT NULL,
ADD COLUMN     "softwareConfigurationId" INTEGER NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ventilatorId" INTEGER;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "firstName" SET DATA TYPE VARCHAR(128),
ALTER COLUMN "lastName" SET DATA TYPE VARCHAR(255);

-- CreateTable
CREATE TABLE "patient" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(128) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "hospitalCode" VARCHAR(128),
    "comorbidities" VARCHAR(256),
    "diagnostic" VARCHAR(128),
    "active" BOOLEAN DEFAULT true,
    "weight" DOUBLE PRECISION,
    "size" DOUBLE PRECISION,
    "sex" "Sex" NOT NULL DEFAULT E'U',
    "skinColor" "SkinColor" NOT NULL DEFAULT E'U',
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMP(3),

    CONSTRAINT "patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "softwareConfiguration" (
    "id" SERIAL NOT NULL,
    "dateTime" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "brightness" DOUBLE PRECISION,
    "language" "Language" NOT NULL DEFAULT E'ES',
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMP(3),

    CONSTRAINT "softwareConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ventilator" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "model" VARCHAR(256),
    "protocol" VARCHAR(256),
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMP(3),

    CONSTRAINT "ventilator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "log" (
    "id" SERIAL NOT NULL,
    "noEvent" INTEGER,
    "comment" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMP(3),
    "eventId" INTEGER,
    "testId" INTEGER NOT NULL,

    CONSTRAINT "log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3),
    "directory" JSONB[],
    "file" TEXT,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMP(3),
    "testId" INTEGER NOT NULL,

    CONSTRAINT "image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipmentConfiguration" (
    "id" SERIAL NOT NULL,
    "adjacent" BOOLEAN DEFAULT true,
    "injectionFrequency" DOUBLE PRECISION,
    "SamplingRate" DOUBLE PRECISION,
    "direction" "Direction" NOT NULL,
    "jump" INTEGER DEFAULT 0,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMP(3),

    CONSTRAINT "equipmentConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comunication" (
    "id" SERIAL NOT NULL,
    "protocol" TEXT,
    "version" TEXT,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMP(3),

    CONSTRAINT "comunication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" SERIAL NOT NULL,
    "active" BOOLEAN DEFAULT true,
    "event" TEXT NOT NULL,
    "description" TEXT,
    "eventType" "EventType" NOT NULL DEFAULT E'OtroEventoQueSeConsidereDeInteres',
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMP(3),

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "record" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMP(3),
    "testId" INTEGER NOT NULL,

    CONSTRAINT "record_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_event_key" ON "event"("event");

-- AddForeignKey
ALTER TABLE "log" ADD CONSTRAINT "log_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log" ADD CONSTRAINT "log_testId_fkey" FOREIGN KEY ("testId") REFERENCES "test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image" ADD CONSTRAINT "image_testId_fkey" FOREIGN KEY ("testId") REFERENCES "test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test" ADD CONSTRAINT "test_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test" ADD CONSTRAINT "test_softwareConfigurationId_fkey" FOREIGN KEY ("softwareConfigurationId") REFERENCES "softwareConfiguration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test" ADD CONSTRAINT "test_ventilatorId_fkey" FOREIGN KEY ("ventilatorId") REFERENCES "ventilator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test" ADD CONSTRAINT "test_equipmentConfigurationId_fkey" FOREIGN KEY ("equipmentConfigurationId") REFERENCES "equipmentConfiguration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "record" ADD CONSTRAINT "record_testId_fkey" FOREIGN KEY ("testId") REFERENCES "test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
