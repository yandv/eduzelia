import { z } from "zod";

export const studentSchema = z.object({
  firstName: z.string().max(255),
  lastName: z.string().max(255),
  birthDate: z.coerce.date(),
});

export interface StudentDto extends z.infer<typeof studentSchema> {
  id: string;
  frequency: number;
  grades: number[];
}
