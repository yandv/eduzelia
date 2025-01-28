import { prisma } from "@/database/prisma";
import { BaseQueryParams } from "@/utils/base-query-params";
import { NextResponse } from "next/server";
import { z } from "zod";

const frequencySchema = z.object({
  students: z.array(z.string().cuid()).max(100),
  description: z.string().max(2048),
  data: z.coerce.date().transform((date) => {
    const utc3 = new Date(date);
    utc3.setHours(utc3.getHours() - 3);
    utc3.setHours(0, 0, 0, 0);
    return utc3;
  }),
});

export async function POST(
  req: Request,
  { params }: BaseQueryParams<{ professorId: string; turmaId: string }>
) {
  const body = await req.json();
  const { professorId, turmaId } = await params;

  const { students, description, data } = frequencySchema.parse(body);

  const [professor, turma] = await Promise.all([
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

  const notExistingStudents = students.filter(
    (student) => !turma.AlunoTurma.some(({ alunoId }) => alunoId === student)
  );

  if (notExistingStudents.length) {
    return NextResponse.json(
      {
        message: `Os alunos ${notExistingStudents.join(
          ", "
        )} não existem na turma ${turmaId}`,
      },
      { status: 400 }
    );
  }

  const notPresentStudents = turma.AlunoTurma.filter(
    ({ alunoId }) => !students.includes(alunoId)
  );

  const studentsUpdate = [
    ...students.map((student) => ({
      alunoTurmaId: turma.AlunoTurma.find(({ alunoId }) => alunoId === student)!
        .id,
      presente: true,
    })),
    ...notPresentStudents.map(({ id }) => ({
      alunoTurmaId: id,
      presente: false,
    })),
  ];

  const frequency = await prisma.aula.upsert({
    create: {
      descricao: description,
      frequencias: {
        createMany: {
          data: studentsUpdate,
        },
      },
      data,
      professorId,
      turmaId,
    },
    update: {
      descricao: description,
      frequencias: {
        updateMany: studentsUpdate.map(({ alunoTurmaId, presente }) => ({
          where: {
            alunoTurmaId,
          },
          data: {
            presente,
          },
        })),
      },
    },
    where: {
      data,
      professorId,
      turmaId,
    },
    select: {
      id: true,
      data: true,
      descricao: true,
      frequencias: true,
    },
  });

  return NextResponse.json(frequency);
}
