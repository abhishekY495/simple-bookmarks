-- CreateEnum
CREATE TYPE "BookmarkParsingStatus" AS ENUM ('processing', 'success', 'failed');

-- AlterTable
ALTER TABLE "Bookmark" ADD COLUMN     "parsingStatus" "BookmarkParsingStatus" NOT NULL DEFAULT 'processing',
ALTER COLUMN "title" DROP NOT NULL;
