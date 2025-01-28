/*
  Warnings:

  - You are about to drop the column `turmaId` on the `aluno` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nome,ano]` on the table `turma` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `alunoTurmaId` to the `frequencia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alunoTurmaId` to the `nota` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "aluno" DROP CONSTRAINT "aluno_turmaId_fkey";

-- DropForeignKey
ALTER TABLE "frequencia" DROP CONSTRAINT "frequencia_alunoId_fkey";

-- DropForeignKey
ALTER TABLE "nota" DROP CONSTRAINT "nota_alunoId_fkey";

-- AlterTable
ALTER TABLE "aluno" DROP COLUMN "turmaId";

-- AlterTable
ALTER TABLE "frequencia" ADD COLUMN     "alunoTurmaId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "nota" ADD COLUMN     "alunoTurmaId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "AlunoTurma" (
    "id" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "turmaId" TEXT NOT NULL,

    CONSTRAINT "AlunoTurma_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AlunoTurma_alunoId_turmaId_key" ON "AlunoTurma"("alunoId", "turmaId");

-- CreateIndex
CREATE UNIQUE INDEX "turma_nome_ano_key" ON "turma"("nome", "ano");

-- AddForeignKey
ALTER TABLE "AlunoTurma" ADD CONSTRAINT "AlunoTurma_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlunoTurma" ADD CONSTRAINT "AlunoTurma_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "turma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nota" ADD CONSTRAINT "nota_alunoTurmaId_fkey" FOREIGN KEY ("alunoTurmaId") REFERENCES "AlunoTurma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frequencia" ADD CONSTRAINT "frequencia_alunoTurmaId_fkey" FOREIGN KEY ("alunoTurmaId") REFERENCES "AlunoTurma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
