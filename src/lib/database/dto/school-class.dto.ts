import { z } from "zod";
import { SubjectDto } from "./subject.dto";

export const createSchoolClassSchema = z.object({
  name: z
    .string()
    .min(3, "O nome da turma precisa ter pelo menos 3 caracteres.")
    .max(255),
  year: z.coerce
    .number()
    .min(2020, "O ano da turma precisa ser maior que 2020.")
    .max(9999, "O ano da turma precisa ser menor que 9999."),
  subjectId: z.string().cuid(),
});

export interface SchoolClassDto
  extends z.infer<typeof createSchoolClassSchema> {
  id: string;
  subject?: SubjectDto;
}
