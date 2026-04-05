/*
  Warnings:

  - You are about to drop the `CollectionBookmark` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CollectionBookmark" DROP CONSTRAINT "CollectionBookmark_bookmarkId_fkey";

-- DropForeignKey
ALTER TABLE "CollectionBookmark" DROP CONSTRAINT "CollectionBookmark_collectionId_fkey";

-- AlterTable
ALTER TABLE "Bookmark" ADD COLUMN     "collectionId" TEXT;

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "CollectionBookmark";

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
