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
CREATE TYPE "EventType" AS ENUM ('Respiratorio', 'Cardiocirculatorios', 'Otros', 'Procederes', 'VentilacionMecanica', 'CambiosDeModalidadFania', 'CambiosPostulares', 'Medicamentos', 'SufractantesPulmonares', 'OtroEventoQueSeConsidereDeInteres');

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMP(3),

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" VARCHAR(128) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "createDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMP(3),
    "active" BOOLEAN DEFAULT true,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "fan" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "model" VARCHAR(256),
    "protocol" VARCHAR(256),
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMP(3),

    CONSTRAINT "fan_pkey" PRIMARY KEY ("id")
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
    "samplingRate" DOUBLE PRECISION,
    "direction" "Direction" NOT NULL,
    "jump" INTEGER DEFAULT 0,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMP(3),

    CONSTRAINT "equipmentConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communication" (
    "id" SERIAL NOT NULL,
    "protocol" TEXT,
    "version" TEXT,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMP(3),

    CONSTRAINT "communication_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "test" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inclination" INTEGER NOT NULL,
    "peep" INTEGER,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMP(3),
    "directory" JSONB[],
    "file" TEXT,
    "position" "PatientPosition" NOT NULL,
    "patientId" INTEGER,
    "fanId" INTEGER,
    "softwareConfigurationId" INTEGER NOT NULL,
    "equipmentConfigurationId" INTEGER NOT NULL,

    CONSTRAINT "test_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "event_event_key" ON "event"("event");

-- CreateIndex
CREATE UNIQUE INDEX "test_softwareConfigurationId_key" ON "test"("softwareConfigurationId");

-- CreateIndex
CREATE UNIQUE INDEX "test_fanId_key" ON "test"("fanId");

-- CreateIndex
CREATE UNIQUE INDEX "test_equipmentConfigurationId_key" ON "test"("equipmentConfigurationId");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "test" ADD CONSTRAINT "test_fanId_fkey" FOREIGN KEY ("fanId") REFERENCES "fan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test" ADD CONSTRAINT "test_equipmentConfigurationId_fkey" FOREIGN KEY ("equipmentConfigurationId") REFERENCES "equipmentConfiguration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "record" ADD CONSTRAINT "record_testId_fkey" FOREIGN KEY ("testId") REFERENCES "test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
