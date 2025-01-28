/*
  Warnings:

  - You are about to drop the column `alunoId` on the `nota` table. All the data in the column will be lost.
  - You are about to drop the column `professorId` on the `nota` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "nota" DROP CONSTRAINT "nota_professorId_fkey";

-- AlterTable
ALTER TABLE "nota" DROP COLUMN "alunoId",
DROP COLUMN "professorId";
