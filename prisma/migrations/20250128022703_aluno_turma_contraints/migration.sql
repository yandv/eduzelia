/*
  Warnings:

  - You are about to drop the column `alunoId` on the `frequencia` table. All the data in the column will be lost.
  - You are about to drop the `AlunoTurma` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AlunoTurma" DROP CONSTRAINT "AlunoTurma_alunoId_fkey";

-- DropForeignKey
ALTER TABLE "AlunoTurma" DROP CONSTRAINT "AlunoTurma_turmaId_fkey";

-- DropForeignKey
ALTER TABLE "frequencia" DROP CONSTRAINT "frequencia_alunoTurmaId_fkey";

-- DropForeignKey
ALTER TABLE "nota" DROP CONSTRAINT "nota_alunoTurmaId_fkey";

-- AlterTable
ALTER TABLE "frequencia" DROP COLUMN "alunoId";

-- DropTable
DROP TABLE "AlunoTurma";

-- CreateTable
CREATE TABLE "aluno_turma" (
    "id" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "turmaId" TEXT NOT NULL,

    CONSTRAINT "aluno_turma_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "aluno_turma_alunoId_turmaId_key" ON "aluno_turma"("alunoId", "turmaId");

-- AddForeignKey
ALTER TABLE "aluno_turma" ADD CONSTRAINT "aluno_turma_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aluno_turma" ADD CONSTRAINT "aluno_turma_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "turma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nota" ADD CONSTRAINT "nota_alunoTurmaId_fkey" FOREIGN KEY ("alunoTurmaId") REFERENCES "aluno_turma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frequencia" ADD CONSTRAINT "frequencia_alunoTurmaId_fkey" FOREIGN KEY ("alunoTurmaId") REFERENCES "aluno_turma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
