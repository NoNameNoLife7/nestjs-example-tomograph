/*
  Warnings:

  - You are about to drop the column `created_date` on the `role` table. All the data in the column will be lost.
  - You are about to drop the column `last_modified` on the `role` table. All the data in the column will be lost.
  - You are about to drop the column `create_date` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `last_modified` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roleId]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdDate` to the `role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastModified` to the `role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createDate` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastModified` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_role_id_fkey";

-- DropIndex
DROP INDEX "user_role_id_key";

-- AlterTable
ALTER TABLE "role" DROP COLUMN "created_date",
DROP COLUMN "last_modified",
ADD COLUMN     "createdDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "lastModified" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "create_date",
DROP COLUMN "first_name",
DROP COLUMN "last_modified",
DROP COLUMN "last_name",
DROP COLUMN "role_id",
ADD COLUMN     "createDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastModified" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "roleId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_roleId_key" ON "user"("roleId");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
