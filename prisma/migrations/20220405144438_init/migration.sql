-- AlterTable
ALTER TABLE "role" ALTER COLUMN "lastModified" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "lastModified" DROP NOT NULL;
