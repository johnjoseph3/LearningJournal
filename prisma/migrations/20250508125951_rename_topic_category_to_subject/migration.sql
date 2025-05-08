/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Topic` table. All the data in the column will be lost.
  - You are about to drop the `TopicCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `subjectId` to the `Topic` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Topic" DROP CONSTRAINT "Topic_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "TopicCategory" DROP CONSTRAINT "TopicCategory_userId_fkey";

-- AlterTable
ALTER TABLE "Topic" DROP COLUMN "categoryId",
ADD COLUMN     "subjectId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "TopicCategory";

-- CreateTable
CREATE TABLE "Subject" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
