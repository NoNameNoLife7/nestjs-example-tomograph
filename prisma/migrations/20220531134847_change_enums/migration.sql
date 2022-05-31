/*
  Warnings:

  - The values [Respiratorio,Cardiocirculatorios,Otros,Procederes,VentilacionMecanica,CambiosDeModalidadFania,CambiosPostulares,Medicamentos,SufractantesPulmonares,OtroEventoQueSeConsidereDeInteres] on the enum `EventType` will be removed. If these variants are still used in the database, this will fail.
  - The values [DecubitoSupino,DecubitoProno,DePie,LateralDerecho,LateralIzquierdo,Sentado] on the enum `PatientPosition` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EventType_new" AS ENUM ('RESPIRATORIO', 'CARDIO_CIRCULATORIOS', 'OTROS', 'PROCEDERES', 'VENTILACION_MECANICA', 'CAMBIOS_DE_MODALIDAD_FANIA', 'CAMBIOS_POSTULARES', 'MEDICAMENTOS', 'SUFRACTANTES_PULMONARES', 'OTRO_EVENTO_QUE_SE_CONSIDERE_DE_INTERES');
ALTER TABLE "event" ALTER COLUMN "eventType" DROP DEFAULT;
ALTER TABLE "event" ALTER COLUMN "eventType" TYPE "EventType_new" USING ("eventType"::text::"EventType_new");
ALTER TYPE "EventType" RENAME TO "EventType_old";
ALTER TYPE "EventType_new" RENAME TO "EventType";
DROP TYPE "EventType_old";
ALTER TABLE "event" ALTER COLUMN "eventType" SET DEFAULT 'OTRO_EVENTO_QUE_SE_CONSIDERE_DE_INTERES';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PatientPosition_new" AS ENUM ('DECUBITO_SUPINO', 'DECUBITO_PRONO', 'DE_PIE', 'LATERAL_DERECHO', 'LATERAL_IZQUIERDO', 'SENTADO');
ALTER TABLE "test" ALTER COLUMN "position" TYPE "PatientPosition_new" USING ("position"::text::"PatientPosition_new");
ALTER TYPE "PatientPosition" RENAME TO "PatientPosition_old";
ALTER TYPE "PatientPosition_new" RENAME TO "PatientPosition";
DROP TYPE "PatientPosition_old";
COMMIT;

-- AlterTable
ALTER TABLE "event" ALTER COLUMN "eventType" SET DEFAULT E'OTRO_EVENTO_QUE_SE_CONSIDERE_DE_INTERES';
