/*
  Warnings:

  - You are about to drop the column `createdDate` on the `communication` table. All the data in the column will be lost.
  - You are about to drop the column `lastModified` on the `communication` table. All the data in the column will be lost.
  - You are about to drop the column `createdDate` on the `equipmentConfiguration` table. All the data in the column will be lost.
  - You are about to drop the column `lastModified` on the `equipmentConfiguration` table. All the data in the column will be lost.
  - You are about to drop the column `createdDate` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `lastModified` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `createdDate` on the `fan` table. All the data in the column will be lost.
  - You are about to drop the column `lastModified` on the `fan` table. All the data in the column will be lost.
  - You are about to drop the column `createdDate` on the `image` table. All the data in the column will be lost.
  - You are about to drop the column `lastModified` on the `image` table. All the data in the column will be lost.
  - You are about to drop the column `createdDate` on the `log` table. All the data in the column will be lost.
  - You are about to drop the column `lastModified` on the `log` table. All the data in the column will be lost.
  - You are about to drop the column `createdDate` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `lastModified` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `createdDate` on the `record` table. All the data in the column will be lost.
  - You are about to drop the column `lastModified` on the `record` table. All the data in the column will be lost.
  - You are about to drop the column `createdDate` on the `role` table. All the data in the column will be lost.
  - You are about to drop the column `lastModified` on the `role` table. All the data in the column will be lost.
  - You are about to drop the column `createdDate` on the `softwareConfiguration` table. All the data in the column will be lost.
  - You are about to drop the column `lastModified` on the `softwareConfiguration` table. All the data in the column will be lost.
  - You are about to drop the column `createdDate` on the `test` table. All the data in the column will be lost.
  - You are about to drop the column `lastModified` on the `test` table. All the data in the column will be lost.
  - You are about to drop the column `lastModified` on the `user` table. All the data in the column will be lost.
  - Added the required column `date` to the `patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "communication" DROP COLUMN "createdDate",
DROP COLUMN "lastModified",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "equipmentConfiguration" DROP COLUMN "createdDate",
DROP COLUMN "lastModified",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "event" DROP COLUMN "createdDate",
DROP COLUMN "lastModified",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "fan" DROP COLUMN "createdDate",
DROP COLUMN "lastModified",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "image" DROP COLUMN "createdDate",
DROP COLUMN "lastModified",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "log" DROP COLUMN "createdDate",
DROP COLUMN "lastModified",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "patient" DROP COLUMN "createdDate",
DROP COLUMN "lastModified",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "record" DROP COLUMN "createdDate",
DROP COLUMN "lastModified",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "role" DROP COLUMN "createdDate",
DROP COLUMN "lastModified",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "softwareConfiguration" DROP COLUMN "createdDate",
DROP COLUMN "lastModified",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "test" DROP COLUMN "createdDate",
DROP COLUMN "lastModified",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "user" DROP COLUMN "lastModified",
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "pathNode" (
    "id" SERIAL NOT NULL,
    "parentId" INTEGER NOT NULL,

    CONSTRAINT "pathNode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pathNode" ADD CONSTRAINT "pathNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "pathNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
