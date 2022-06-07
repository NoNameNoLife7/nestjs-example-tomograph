-- CreateEnum
CREATE TYPE "SkinColor" AS ENUM ('U', 'W', 'B');

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('U', 'M', 'F');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('ES', 'EN');

-- CreateEnum
CREATE TYPE "Direction" AS ENUM ('IZQ_DER', 'DER_IZQ');

-- CreateEnum
CREATE TYPE "PatientPosition" AS ENUM ('DECUBITO_SUPINO', 'DECUBITO_PRONO', 'DE_PIE', 'LATERAL_DERECHO', 'LATERAL_IZQUIERDO', 'SENTADO');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('RESPIRATORIO', 'CARDIO_CIRCULATORIOS', 'OTROS', 'PROCEDERES', 'VENTILACION_MECANICA', 'CAMBIOS_DE_MODALIDAD_FANIA', 'CAMBIOS_POSTULARES', 'MEDICAMENTOS', 'SUFRACTANTES_PULMONARES', 'OTRO_EVENTO_QUE_SE_CONSIDERE_DE_INTERES');

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" VARCHAR(128) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "createDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "active" BOOLEAN DEFAULT true,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(128) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "hospitalCode" VARCHAR(128),
    "comorbidities" VARCHAR(256),
    "diagnostic" VARCHAR(128),
    "active" BOOLEAN DEFAULT true,
    "weight" DOUBLE PRECISION,
    "size" DOUBLE PRECISION,
    "sex" "Sex" NOT NULL DEFAULT E'U',
    "skinColor" "SkinColor" NOT NULL DEFAULT E'U',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fan" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "model" VARCHAR(256),
    "protocol" VARCHAR(256),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "fan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "log" (
    "id" SERIAL NOT NULL,
    "noEvent" INTEGER,
    "comment" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "testId" INTEGER NOT NULL,

    CONSTRAINT "image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pathNode" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" INTEGER,

    CONSTRAINT "pathNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipmentConfiguration" (
    "id" SERIAL NOT NULL,
    "adjacent" BOOLEAN DEFAULT true,
    "injectionFrequency" INTEGER DEFAULT 60,
    "samplingRate" INTEGER DEFAULT 15,
    "direction" "Direction" NOT NULL,
    "jump" INTEGER DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "equipmentConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "softwareConfiguration" (
    "id" SERIAL NOT NULL,
    "dateTime" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "brightness" DOUBLE PRECISION NOT NULL,
    "language" "Language" NOT NULL DEFAULT E'ES',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "softwareConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communication" (
    "id" SERIAL NOT NULL,
    "protocol" TEXT,
    "version" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "communication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" SERIAL NOT NULL,
    "active" BOOLEAN DEFAULT true,
    "event" TEXT NOT NULL,
    "description" TEXT,
    "eventType" "EventType" NOT NULL DEFAULT E'OTRO_EVENTO_QUE_SE_CONSIDERE_DE_INTERES',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inclination" INTEGER NOT NULL,
    "peep" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "testId" INTEGER NOT NULL,

    CONSTRAINT "record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_pathNodeTotest" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "fan_name_key" ON "fan"("name");

-- CreateIndex
CREATE UNIQUE INDEX "pathNode_name_key" ON "pathNode"("name");

-- CreateIndex
CREATE UNIQUE INDEX "event_event_key" ON "event"("event");

-- CreateIndex
CREATE UNIQUE INDEX "_pathNodeTotest_AB_unique" ON "_pathNodeTotest"("A", "B");

-- CreateIndex
CREATE INDEX "_pathNodeTotest_B_index" ON "_pathNodeTotest"("B");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log" ADD CONSTRAINT "log_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log" ADD CONSTRAINT "log_testId_fkey" FOREIGN KEY ("testId") REFERENCES "test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image" ADD CONSTRAINT "image_testId_fkey" FOREIGN KEY ("testId") REFERENCES "test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pathNode" ADD CONSTRAINT "pathNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "pathNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test" ADD CONSTRAINT "test_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test" ADD CONSTRAINT "test_fanId_fkey" FOREIGN KEY ("fanId") REFERENCES "fan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test" ADD CONSTRAINT "test_equipmentConfigurationId_fkey" FOREIGN KEY ("equipmentConfigurationId") REFERENCES "equipmentConfiguration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test" ADD CONSTRAINT "test_softwareConfigurationId_fkey" FOREIGN KEY ("softwareConfigurationId") REFERENCES "softwareConfiguration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "record" ADD CONSTRAINT "record_testId_fkey" FOREIGN KEY ("testId") REFERENCES "test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_pathNodeTotest" ADD FOREIGN KEY ("A") REFERENCES "pathNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_pathNodeTotest" ADD FOREIGN KEY ("B") REFERENCES "test"("id") ON DELETE CASCADE ON UPDATE CASCADE;
