/*
  Warnings:

  - The values [BocaArriba,BocaAbajo] on the enum `PatientPosition` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PatientPosition_new" AS ENUM ('DecubitoSupino', 'DecubitoProno', 'DePie', 'LateralDerecho', 'LateralIzquierdo', 'Sentado');
ALTER TABLE "test" ALTER COLUMN "position" TYPE "PatientPosition_new" USING ("position"::text::"PatientPosition_new");
ALTER TYPE "PatientPosition" RENAME TO "PatientPosition_old";
ALTER TYPE "PatientPosition_new" RENAME TO "PatientPosition";
DROP TYPE "PatientPosition_old";
COMMIT;
