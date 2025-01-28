import { toCursorResponse } from "@/database/dto/pagination-cursor.dto";
import { prisma } from "@/database/prisma";
import { BaseQueryParams } from "@/utils/base-query-params";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: BaseQueryParams<{ professorId: string; turmaId: string }>
) {
  const { professorId, turmaId } = await params;

  const [professor, turma] = await Promise.all([
    prisma.professor.findFirst({
      where: {
        id: professorId,
      },
    }),
    prisma.turma.findFirst({
      where: {
        id: turmaId,
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

  const alunos = await prisma.aluno.findMany({
    where: {
      AlunoTurma: {
        every: {
          turmaId,
        },
      },
    },
    include: {
      AlunoTurma: {
        where: {
          turmaId: turmaId,
        },
        include: {
          frequencias: true,
          notas: true,
        },
      },
    },
  });

  const response = alunos.map(({ id, nome, AlunoTurma: [turma] }) => {
    const presencas = turma.frequencias.filter(
      ({ presente }) => presente
    ).length;
    const media =
      turma.notas.reduce((acc, { valor }) => acc + valor, 0) /
      Math.max(turma.notas.length, 1);

    return {
      id,
      nome,
      frequencia: Math.round((presencas / turma.frequencias.length) * 100),
      notas: turma.notas.map(({ valor }) => valor),
      media,
    };
  });

  return NextResponse.json(toCursorResponse(response));
}
