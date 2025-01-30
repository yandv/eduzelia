import { toCursorResponse } from "@/lib/database/dto/pagination-cursor.dto";
import { prisma } from "@/lib/database/prisma";
import { BaseQueryParams } from "@/lib/utils/base-query-params";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: BaseQueryParams<{ teacherId: string }>
) {
  const { teacherId } = await params;

  const teacher = await prisma.teacher.findFirst({
    where: {
      id: teacherId,
    },
  });

  if (!teacher) {
    return NextResponse.json(
      { message: `O professor ${teacherId} não existe` },
      { status: 404 }
    );
  }

  const subjects = await prisma.subject.findMany({
    where: {
      teachers: {
        some: {
          id: teacherId,
        },
      },
    },
  });

  return NextResponse.json(toCursorResponse(subjects));
}
