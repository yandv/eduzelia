import { prisma } from "@/lib/database/prisma";
import { BaseQueryParams } from "@/lib/utils/base-query-params";
import { NextResponse } from "next/server";
import { z } from "zod";

const vincularTurmaSchema = z.object({
  turmaId: z.string().cuid(),
});

export async function POST(
  req: Request,
  { params }: BaseQueryParams<{ alunoId: string }>
) {
  const body = await req.json();
  const { alunoId } = await params;

  const { turmaId } = vincularTurmaSchema.parse(body);

  const aluno = await prisma.aluno.findFirst({
    where: {
      id: alunoId,
    },
  });

  if (!aluno) {
    return NextResponse.json(
      { message: `O aluno ${alunoId} não existe` },
      { status: 404 }
    );
  }

  const turma = await prisma.turma.findFirst({
    where: {
      id: turmaId,
    },
  });

  if (!turma) {
    return NextResponse.json(
      { message: `A turma ${turmaId} não existe` },
      { status: 404 }
    );
  }

  const vinculoAtual = await prisma.alunoTurma.findFirst({
    where: {
      alunoId,
      turmaId,
    },
  });

  if (vinculoAtual) {
    return NextResponse.json(
      { message: `O aluno ${alunoId} já está vinculado à turma ${turmaId}` },
      { status: 409 }
    );
  }

  const vinculo = await prisma.$transaction(async (tx) => {
    const vinculo = await tx.alunoTurma.create({
      data: {
        alunoId,
        turmaId,
      },
    });

    const aulas = await tx.aula.findMany({
      where: {
        turmaId,
      },
    });

    await tx.frequencia.createMany({
      data: aulas.map((aula) => ({
        aulaId: aula.id,
        alunoTurmaId: vinculo.id,
        presente: false,
      })),
    });

    return vinculo;
  });

  return NextResponse.json(vinculo, { status: 201 });
}
