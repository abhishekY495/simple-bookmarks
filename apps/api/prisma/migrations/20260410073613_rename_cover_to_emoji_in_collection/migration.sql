/*
  Warnings:

  - You are about to drop the column `cover` on the `Collection` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "cover",
ADD COLUMN     "emoji" TEXT DEFAULT '📁';
