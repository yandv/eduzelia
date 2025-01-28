/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `professor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "professor" ADD COLUMN     "email" TEXT NOT NULL DEFAULT 'default@email.com',
ADD COLUMN     "senha" TEXT NOT NULL DEFAULT '123456';

-- CreateIndex
CREATE UNIQUE INDEX "professor_email_key" ON "professor"("email");
