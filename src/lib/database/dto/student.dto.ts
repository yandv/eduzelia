import { z } from "zod";

function toPascalCase(str: string) {
  return str
    .trim()
    .split(" ")
    .map((word) =>
      word.length > 3 ? word[0].toUpperCase() + word.slice(1).toLowerCase() : word.toLowerCase()
    )
    .join(" ");
}

export const createStudentSchema = z.object({
  firstName: z
    .string()
    .max(255)
    .transform((v) => toPascalCase(v)),
  lastName: z
    .string()
    .max(255)
    .transform((v) => toPascalCase(v)),
  birthDate: z.coerce.date(),
  schoolClassId: z.string().cuid(),
});

export const deleteStudentsSchema = z.object({
  students: z.array(z.string().cuid()),
  schoolClassId: z.string().cuid(),
});

export interface CreateStudentRequestDto
  extends z.infer<typeof createStudentSchema> {}

export interface StudentDto extends z.infer<typeof createStudentSchema> {
  id: string;
  frequency: number;
  grades: number[];
}
