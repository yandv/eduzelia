export function toCursorResponse<T>(data: T[]) {
  return {
    data,
    cursor: {},
  };
}

export interface PageCursorResponseDto<T> {
  data: T[];
  cursor: string;
}
