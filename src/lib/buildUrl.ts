import type { Origin, Pathname } from "./types";

/**
 * Builds a full absolute URL on the given origin while preserving
 * optional query string (`search`) and hash fragment (`hash`).
 *
 * Uses the native `URL` constructor to ensure correct joining of
 * origin, pathname, search, and hash.
 *
 * @param origin   - The base origin (e.g. "https://example.com"), must include protocol.
 * @param pathname - The normalized absolute pathname, starting with `/`.
 * @param options  - Optional settings for query and hash.
 * @param options.search - Query string, including leading "?" (e.g. "?page=2").
 * @param options.hash   - Hash fragment, including leading "#" (e.g. "#top").
 * @returns A fully qualified URL string.
 *
 * @example
 * buildTargetUrl("https://example.com", "/blog");
 * // → "https://example.com/blog"
 *
 * @example
 * buildTargetUrl("https://example.com", "/blog", { search: "?page=2", hash: "#top" });
 * // → "https://example.com/blog?page=2#top"
 */
export function buildTargetUrl(
  origin: Origin,
  pathname: Pathname,
  options: { search?: string; hash?: string } = {},
): string {
  const url = new URL(pathname, origin);
  if (options.search) url.search = options.search;
  if (options.hash) url.hash = options.hash;
  return url.toString();
}

export function createTargetUrlBuilder(origin: Origin) {
  return (
    pathname: Pathname,
    options: { search?: string; hash?: string } = {},
  ) => buildTargetUrl(origin, pathname, options);
}
