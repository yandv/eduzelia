"use server";

import { prisma } from "../../database/prisma";
import { revalidateTag } from "next/cache";
import { deleteStudentsSchema } from "../../database/dto/student.dto";
import { FormState } from "../../utils/system";
import { z } from "zod";

type DeleteStudentsForm = z.infer<typeof deleteStudentsSchema>;

export async function deleteStudents(
  formData: FormData
): Promise<FormState<DeleteStudentsForm>> {
  const validatedFields = deleteStudentsSchema.safeParse({
    students: (formData.get("students") as string ?? "").split(","),
    schoolClassId: formData.get("schoolClassId"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { students, schoolClassId } = validatedFields.data;

  await prisma.studentSchoolClass.deleteMany({
    where: {
      studentId: {
        in: students,
      },
      schoolClassId,
    },
  });

  revalidateTag("students");
}
