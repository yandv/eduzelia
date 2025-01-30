import { toCursorResponse } from "@/lib/database/dto/pagination-cursor.dto";
import { prisma } from "@/lib/database/prisma";
import { BaseQueryParams } from "@/lib/utils/base-query-params";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  {
    params,
  }: BaseQueryParams<{
    teacherId: string;
    subjectId: string;
    schoolClassId: string;
  }>
) {
  const { teacherId, subjectId, schoolClassId } = await params;

  const schoolClass = await prisma.schoolClass.findFirst({
    where: {
      id: schoolClassId,
      subject: {
        id: subjectId,
        teachers: {
          some: {
            id: teacherId,
          },
        },
      },
    },
  });

  if (!schoolClass) {
    return NextResponse.json(
      { message: `O professor, a disciplina ou a turma não existe.` },
      { status: 404 }
    );
  }

  const students = await prisma.student.findMany({
    where: {
      studentSchoolClass: {
        every: {
          schoolClassId,
        },
      },
    },
    include: {
      studentSchoolClass: {
        where: {
          schoolClassId: schoolClassId,
        },
        include: {
          frequencies: true,
          grades: true,
        },
      },
    },
  });

  const response = students.map(
    ({ id, firstName, lastName, birthDate, studentSchoolClass: [turma] }) => {
      const presencas = turma.frequencies.filter(
        ({ presente }) => presente
      ).length;

      return {
        id,
        firstName,
        lastName,
        birthDate,
        frequencia: Math.round((presencas / turma.frequencies.length) * 100),
        grades: turma.grades.map(({ value }) => value),
      };
    }
  );

  return NextResponse.json(toCursorResponse(response));
}
