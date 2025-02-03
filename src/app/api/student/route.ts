import { toCursorResponse } from "@/lib/database/dto/pagination-cursor.dto";
import { prisma } from "@/lib/database/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const createStudentSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  birthDate: z.coerce.date(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const schema = createStudentSchema.parse(body);

  const student = await prisma.student.create({
    data: schema,
  });

  return NextResponse.json(student, { status: 201 });
}

export async function GET() {
  const students = await prisma.student.findMany();

  return NextResponse.json(toCursorResponse(students));
}
