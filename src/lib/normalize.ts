import type { AppConfigOptions, Pathname } from "./types";

/**
 * Function that normalizes a pathname according to options (lowercase + trailing slash).
 *
 * @param pathname - Absolute pathname
 * @param options  - Normalization flags (lowercase, trailingSlash).
 * @returns A normalized pathname
 */
export function normalizePath(
  pathname: Pathname,
  options: AppConfigOptions = {},
): Pathname {
  const {
    normalizeLowerCasePath: lowercase = false,
    normalizeTrailingSlash: trailingSlash = "preserve",
  } = options;

  let p = lowercase ? (pathname.toLowerCase() as Pathname) : pathname;

  if (trailingSlash === "strip") {
    if (p !== "/" && p.endsWith("/")) {
      p = p.slice(0, -1) as Pathname;
    }
  } else if (trailingSlash === "ensure") {
    if (!p.endsWith("/")) {
      p = `${p}/` as Pathname;
    }
  }

  return p;
}

/**
 * Creates a reusable, pure normalizer bound to fixed options.
 *
 * @example
 * const normalize = createPathNormalizer({ lowercase: true, trailingSlash: "strip" });
 * normalize("/Blog/Hello/"); // → "/blog/hello"
 */
export function createPathNormalizer(options: AppConfigOptions) {
  return (pathname: Pathname) => normalizePath(pathname, options);
}
