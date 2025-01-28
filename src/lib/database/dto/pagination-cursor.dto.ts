import { z } from "zod";

const paginationCursorRequestSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  orderBy: z.string().optional(),
});

export function toCursorResponse<T>(data: T[]) {
  return {
    data,
    cursor: {},
  };
}

export type PaginationCursorRequestDto = z.infer<
  typeof paginationCursorRequestSchema
>;
