import { unstable_cache } from 'next/cache';

// TODO: there is definitely a way to get this to work
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function withUnstableCache<T extends (...args: any[]) => Promise<any>>(opts: {
  fn: T;
  args: Parameters<T>;
  keys: string[];
  tags: string[];
}) {
  const cachedResult = await unstable_cache(
    async (...args) => {
      const result = await opts.fn(...args);
      return result;
    },
    [...opts.keys],
    { tags: opts.tags },
  )(...opts.args);

  return cachedResult as Awaited<ReturnType<T>>;
}
