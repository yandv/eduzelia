/*
  Warnings:

  - A unique constraint covering the columns `[data]` on the table `aula` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[data,turmaId,professorId]` on the table `aula` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "aula_data_key" ON "aula"("data");

-- CreateIndex
CREATE UNIQUE INDEX "aula_data_turmaId_professorId_key" ON "aula"("data", "turmaId", "professorId");
