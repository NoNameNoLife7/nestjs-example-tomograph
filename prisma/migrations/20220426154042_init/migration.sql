/*
  Warnings:

  - A unique constraint covering the columns `[firstName,lastName]` on the table `patient` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "patient_firstName_lastName_key" ON "patient"("firstName", "lastName");
