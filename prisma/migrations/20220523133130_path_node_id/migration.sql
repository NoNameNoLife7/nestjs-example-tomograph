-- DropForeignKey
ALTER TABLE "pathNode" DROP CONSTRAINT "pathNode_parentId_fkey";

-- AlterTable
ALTER TABLE "pathNode" ALTER COLUMN "parentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "pathNode" ADD CONSTRAINT "pathNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "pathNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
