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

  const turma = await prisma.schoolClass.findFirst({
    where: {
      id: schoolClassId,
      subjectId,
    },
  });

  return NextResponse.json(turma);
}
