import { prisma } from "@/lib/database/prisma";
import { BaseQueryParams } from "@/lib/utils/base-query-params";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: BaseQueryParams<{ teacherId: string; subjectId: string }>
) {
  const { teacherId, subjectId } = await params;

  const subject = await prisma.subject.findFirst({
    where: {
      id: subjectId,
      teachers: {
        some: {
          id: teacherId,
        },
      },
    },
    include: {
      teachers: {
        omit: {
          password: true,
        },
      },
    },
  });

  if (!subject) {
    return NextResponse.json(
      { message: `A disciplina ou o professor não existe.` },
      { status: 404 }
    );
  }

  return NextResponse.json(subject);
}
