-- CreateTable
CREATE TABLE "professor" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "professor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aluno" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "turmaId" TEXT NOT NULL,

    CONSTRAINT "aluno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turma" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "professorId" TEXT NOT NULL,

    CONSTRAINT "turma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aula" (
    "id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "descricao" VARCHAR(2048) NOT NULL,
    "turmaId" TEXT NOT NULL,
    "professorId" TEXT NOT NULL,

    CONSTRAINT "aula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nota" (
    "id" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "alunoId" TEXT NOT NULL,
    "professorId" TEXT NOT NULL,

    CONSTRAINT "nota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "frequencia" (
    "id" TEXT NOT NULL,
    "presente" BOOLEAN NOT NULL,
    "alunoId" TEXT NOT NULL,
    "aulaId" TEXT NOT NULL,

    CONSTRAINT "frequencia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "aluno" ADD CONSTRAINT "aluno_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "turma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turma" ADD CONSTRAINT "turma_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aula" ADD CONSTRAINT "aula_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "turma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aula" ADD CONSTRAINT "aula_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nota" ADD CONSTRAINT "nota_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nota" ADD CONSTRAINT "nota_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frequencia" ADD CONSTRAINT "frequencia_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frequencia" ADD CONSTRAINT "frequencia_aulaId_fkey" FOREIGN KEY ("aulaId") REFERENCES "aula"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
