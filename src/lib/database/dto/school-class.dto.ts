import { z } from "zod";

export const createSchoolClassSchema = z.object({
  name: z.string().max(255),
  year: z.number().min(2020).max(9999),
});

export interface SchoolClassDto
  extends z.infer<typeof createSchoolClassSchema> {
  id: string;
}
