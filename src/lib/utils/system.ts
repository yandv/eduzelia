export function request<T>(
  input: string | URL | globalThis.Request,
  init?: RequestInit
) {
  return fetch(input, init).then<T>(async (response) => {
    if (!response.ok) {
      console.log(input);
      throw new Error(await response.text());
    }

    return await response.json();
  });
}

export type CacheReturn<T> = () => Promise<T>;
