"use server";

import { z } from "zod";
import { prisma } from "../database/prisma";
import { FormState } from "../utils/system";
import { createSchoolClassSchema } from "../database/dto/school-class.dto";
import { getUserSession } from "./user-session.action";
import { revalidateTag } from "next/cache";

type CreateSchoolClassForm = z.infer<typeof createSchoolClassSchema>;

export async function createSchoolClass(
  _: FormState<CreateSchoolClassForm>,
  formData: FormData
) {
  const validatedFields = createSchoolClassSchema.safeParse({
    name: formData.get("name"),
    year: formData.get("year"),
    subjectId: formData.get("subjectId"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, year, subjectId } = validatedFields.data;
  const { user } = await getUserSession();

  await prisma.schoolClass.create({
    data: {
      name,
      year,
      subject: {
        connect: {
          id: subjectId,
          teachers: {
            some: {
              id: user!.id,
            },
          },
        },
      },
    },
  });

  revalidateTag("school-classes");
}
