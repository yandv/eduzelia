import { z } from "zod";

export const createTeacherSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export interface TeacherDto
  extends Omit<z.infer<typeof createTeacherSchema>, "password"> {}
