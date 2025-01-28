import { prisma } from "@/database/prisma";
import { BaseQueryParams } from "@/utils/base-query-params";
import { NextResponse } from "next/server";
import { z } from "zod";

const gradeSchema = z.object({
  valor: z.number().int().min(0).max(10),
  index: z.number().int().min(1).max(10),
});

export async function POST(
  req: Request,
  {
    params,
  }: BaseQueryParams<{ professorId: string; turmaId: string; alunoId: string }>
) {
  const body = await req.json();
  const { professorId, turmaId, alunoId } = await params;

  const notas = gradeSchema.parse(body);

  const [professor, turma, aluno] = await Promise.all([
    prisma.professor.findFirst({
      where: {
        id: professorId,
      },
    }),
    prisma.turma.findFirst({
      where: {
        id: turmaId,
        professorId,
      },
      include: {
        AlunoTurma: true,
      },
    }),
    prisma.aluno.findFirst({
      where: {
        id: alunoId,
      },
    }),
  ]);

  if (!professor) {
    return NextResponse.json(
      { message: `O professor ${professorId} não existe` },
      { status: 404 }
    );
  }

  if (!turma) {
    return NextResponse.json(
      { message: `A turma ${turmaId} não existe` },
      { status: 404 }
    );
  }

  if (!aluno) {
    return NextResponse.json(
      { message: `O aluno ${alunoId} não existe` },
      { status: 404 }
    );
  }

  const alunoTurma = await prisma.alunoTurma.findFirst({
    where: {
      alunoId,
      turmaId,
    },
  });

  if (!alunoTurma) {
    return NextResponse.json(
      {
        message: `O aluno ${alunoId} não está matriculado na turma ${turmaId}`,
      },
      { status: 409 }
    );
  }

  const createdGrades = await prisma.nota.upsert({
    where: {
      index_alunoTurmaId: {
        index: notas.index,
        alunoTurmaId: alunoTurma.id,
      },
    },
    update: {
      valor: notas.valor,
    },
    create: {
      valor: notas.valor,
      index: notas.index,
      alunoTurmaId: alunoTurma.id,
    },
  });

  return NextResponse.json(createdGrades);
}
