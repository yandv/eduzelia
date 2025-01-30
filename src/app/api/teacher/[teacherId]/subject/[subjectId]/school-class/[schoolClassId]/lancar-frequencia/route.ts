import { prisma } from "@/lib/database/prisma";
import { BaseQueryParams } from "@/lib/utils/base-query-params";
import { NextResponse } from "next/server";
import { z } from "zod";

const frequencySchema = z.object({
  students: z.array(z.string().cuid()).max(100),
  description: z.string().max(2048),
  date: z.coerce.date().transform((date) => {
    const utc3 = new Date(date);
    utc3.setHours(utc3.getHours() - 3);
    utc3.setHours(0, 0, 0, 0);
    return utc3;
  }),
});

export async function POST(
  req: Request,
  {
    params,
  }: BaseQueryParams<{
    teacherId: string;
    subjectId: string;
    schoolClassId: string;
  }>
) {
  const body = await req.json();
  const { teacherId, subjectId, schoolClassId } = await params;

  const { students, description, date } = frequencySchema.parse(body);

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
    include: {
      studentSchoolClasses: true,
    },
  });

  if (!schoolClass) {
    return NextResponse.json(
      { message: `O professor, a disciplina ou a turma não existe.` },
      { status: 404 }
    );
  }

  const notExistingStudents = students.filter(
    (student) =>
      !schoolClass.studentSchoolClasses.some(
        ({ studentId }) => studentId === student
      )
  );

  if (notExistingStudents.length) {
    return NextResponse.json(
      {
        message: `Os alunos ${notExistingStudents.join(
          ", "
        )} não existem na turma ${schoolClassId}`,
      },
      { status: 400 }
    );
  }

  const notPresentStudents = schoolClass.studentSchoolClasses.filter(
    ({ studentId }) => !students.includes(studentId)
  );

  const studentsUpdate = [
    ...students.map((student) => ({
      studentSchoolClassId: schoolClass.studentSchoolClasses.find(
        ({ studentId }) => studentId === student
      )!.id,
      presente: true,
    })),
    ...notPresentStudents.map(({ id }) => ({
      studentSchoolClassId: id,
      presente: false,
    })),
  ];

  const frequency = await prisma.session.upsert({
    create: {
      description,
      frequencies: {
        createMany: {
          data: studentsUpdate,
        },
      },
      date,
      teacherId,
      schoolClassId,
    },
    update: {
      description,
      frequencies: {
        updateMany: studentsUpdate.map(
          ({ studentSchoolClassId, presente }) => ({
            where: {
              studentSchoolClassId,
            },
            data: {
              presente,
            },
          })
        ),
      },
    },
    where: {
      date,
      teacherId,
      schoolClassId,
    },
    select: {
      id: true,
      date: true,
      description: true,
      frequencies: true,
    },
  });

  return NextResponse.json(frequency);
}
