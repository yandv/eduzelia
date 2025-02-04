export function request<T>(
  input: string | URL | globalThis.Request,
  init?: RequestInit
) {
  return fetch(input, init).then<T>(async (response) => {
    // await new Promise((resolve) => setTimeout(resolve, 500));

    if (!response.ok) {
      console.log(input);
      throw new Error(await response.text());
    }

    return await response.json();
  });
}

export type CacheReturn<T> = () => Promise<T>;

export type FormState<T> =
  | {
      errors?: {
        [K in keyof T]?: string[];
      };
      message?: string;
    }
  | undefined;
