/*
  Warnings:

  - A unique constraint covering the columns `[slug,userId]` on the table `Page` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Page_slug_topicId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_userId_key" ON "Page"("slug", "userId");
