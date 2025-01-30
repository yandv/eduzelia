import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string(),
});

export interface UserDto extends Omit<z.infer<typeof userSchema>, "password"> {}
