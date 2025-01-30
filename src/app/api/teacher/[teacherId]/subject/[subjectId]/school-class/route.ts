import { toCursorResponse } from "@/lib/database/dto/pagination-cursor.dto";
import { createSchoolClassSchema } from "@/lib/database/dto/school-class.dto";
import { prisma } from "@/lib/database/prisma";
import { BaseQueryParams } from "@/lib/utils/base-query-params";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(
  req: Request,
  { params }: BaseQueryParams<{ teacherId: string; subjectId: string }>
) {
  const body = await req.json();
  const { teacherId, subjectId } = await params;
  const { name, year } = createSchoolClassSchema.parse(body);

  const subject = await prisma.subject.findFirst({
    where: {
      id: subjectId,
      teachers: {
        some: {
          id: teacherId,
        },
      },
    },
  });

  if (!subject) {
    return NextResponse.json(
      { message: `O professor ou a disciplina não existe.` },
      { status: 404 }
    );
  }

  const schoolClass = await prisma.schoolClass.create({
    data: {
      name,
      year,
      subjectId,
    },
  });

  return NextResponse.json(schoolClass, { status: 201 });
}

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
  });

  if (!subject) {
    return NextResponse.json(
      { message: `A disciplina ou o professor não existe.` },
      { status: 404 }
    );
  }

  const schoolClasses = await prisma.schoolClass.findMany({
    where: {
      subjectId,
    },
  });

  return NextResponse.json(toCursorResponse(schoolClasses));
}
