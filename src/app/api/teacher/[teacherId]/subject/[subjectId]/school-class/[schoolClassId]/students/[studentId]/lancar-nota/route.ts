import { prisma } from "@/lib/database/prisma";
import { BaseQueryParams } from "@/lib/utils/base-query-params";
import { NextResponse } from "next/server";
import { z } from "zod";

const gradeSchema = z.object({
  grade: z.number().int().min(0).max(10),
  index: z.number().int().min(1).max(10),
});

export async function POST(
  req: Request,
  {
    params,
  }: BaseQueryParams<{
    teacherId: string;
    subjectId: string;
    schoolClassId: string;
    studentId: string;
  }>
) {
  const body = await req.json();
  const { teacherId, subjectId, schoolClassId, studentId } = await params;

  const grades = gradeSchema.parse(body);

  const studentSchoolClass = await prisma.studentSchoolClass.findFirst({
    where: {
      id: studentId,
      schoolClass: {
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
    },
  });

  if (!studentSchoolClass) {
    return NextResponse.json(
      {
        message: `O professor, a disciplina, a turma ou o aluno não existe. O aluno pode não estar vinculado a essa turma.`,
      },
      { status: 404 }
    );
  }

  const createdGrades = await prisma.grade.upsert({
    where: {
      index_studentId_schoolClassId: {
        index: grades.index,
        studentId,
        schoolClassId,
      },
    },
    update: {
      value: grades.grade,
    },
    create: {
      value: grades.grade,
      index: grades.index,
      schoolClassId: studentSchoolClass.id,
      studentId: studentId,
    },
  });

  return NextResponse.json(createdGrades);
}
