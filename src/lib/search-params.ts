// src/lib/search-params.ts
type RawSearchParams = Record<string, string | string[] | undefined>;

// ?search=a&search=b হলে Next একটা array দেয়, আমরা প্রথমটাই নিই
export function getParam(
  params: RawSearchParams,
  key: string,
): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

// URL থেকে আসা সব ডেটা অবিশ্বস্ত: ?page=abc বা ?page=-5 হলে 1 ধরবো
export function getPageParam(params: RawSearchParams): number {
  const page = Number(getParam(params, "page"));
  return Number.isInteger(page) && page > 0 ? page : 1;
}
