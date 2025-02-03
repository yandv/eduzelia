import { z } from "zod";

export const subjectSchema = z.object({
  name: z.string().max(255),
});

export interface SubjectDto extends z.infer<typeof subjectSchema> {
  id: string;
}
