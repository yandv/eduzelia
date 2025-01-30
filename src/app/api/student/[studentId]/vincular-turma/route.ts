import { prisma } from "@/lib/database/prisma";
import { BaseQueryParams } from "@/lib/utils/base-query-params";
import { NextResponse } from "next/server";
import { z } from "zod";

const vincularTurmaSchema = z.object({
  schoolClassId: z.string().cuid(),
});

export async function POST(
  req: Request,
  { params }: BaseQueryParams<{ studentId: string }>
) {
  const body = await req.json();
  const { studentId } = await params;

  const { schoolClassId } = vincularTurmaSchema.parse(body);

  const turma = await prisma.schoolClass.findFirst({
    where: {
      id: schoolClassId,
    },
  });

  if (!turma) {
    return NextResponse.json(
      { message: `A turma ${schoolClassId} não existe` },
      { status: 404 }
    );
  }

  const vinculoAtual = await prisma.studentSchoolClass.findFirst({
    where: {
      studentId,
      schoolClassId,
    },
  });

  if (vinculoAtual) {
    return NextResponse.json(
      {
        message: `O aluno ${studentId} já está vinculado à turma ${schoolClassId}`,
      },
      { status: 409 }
    );
  }

  const vinculo = await prisma.$transaction(async (tx) => {
    const vinculo = await tx.studentSchoolClass.create({
      data: {
        studentId,
        schoolClassId,
      },
    });

    const aulas = await tx.session.findMany({
      where: {
        schoolClassId,
      },
    });

    await tx.frequency.createMany({
      data: aulas.map((aula) => ({
        sessionId: aula.id,
        studentSchoolClassId: vinculo.id,
        presente: false,
      })),
    });

    return vinculo;
  });

  return NextResponse.json(vinculo, { status: 201 });
}
