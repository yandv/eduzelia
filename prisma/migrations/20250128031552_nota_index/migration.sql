/*
  Warnings:

  - A unique constraint covering the columns `[index,alunoTurmaId]` on the table `nota` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `index` to the `nota` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "nota" ADD COLUMN     "index" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "nota_index_alunoTurmaId_key" ON "nota"("index", "alunoTurmaId");
