"use server";

import { prisma } from "../../database/prisma";
import { revalidateTag } from "next/cache";
import { createStudentSchema } from "../../database/dto/student.dto";
import { FormState } from "../../utils/system";
import { z } from "zod";

type CreateStudenForm = z.infer<typeof createStudentSchema>;

export async function createStudent(
  formData: FormData
): Promise<FormState<CreateStudenForm>> {
  const validatedFields = createStudentSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    birthDate: formData.get("birthDate"),
    schoolClassId: formData.get("schoolClassId"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { firstName, lastName, birthDate, schoolClassId } =
    validatedFields.data;

  const student = await prisma.student.create({
    data: {
      firstName,
      lastName,
      birthDate,
      studentSchoolClass: {
        create: {
          schoolClass: {
            connect: {
              id: schoolClassId,
            },
          },
        },
      },
    },
  });

  revalidateTag("students");
}
