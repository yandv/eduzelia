import { prisma } from "@/lib/database/prisma";
import { BaseQueryParams } from "@/lib/utils/base-query-params";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: BaseQueryParams<{ studentId: string }>
) {
  const { studentId } = await params;

  const student = await prisma.student.findFirst({
    where: {
      id: studentId,
    },
  });

  if (!student) {
    return NextResponse.json(
      { message: `O aluno ${studentId} não existe` },
      { status: 404 }
    );
  }

  return NextResponse.json(student);
}
