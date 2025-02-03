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

  return NextResponse.json(teacher);
}
