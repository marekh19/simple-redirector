import type {
  ExactRules,
  GoneRules,
  Pathname,
  PatternRule,
  PatternRules,
} from "./types";

/**
 * Builds a map of exact redirect rules.
 *
 * Each pair maps an exact source pathname (`from`) to an exact destination
 * pathname (`to`). No pattern matching is applied — only exact matches redirect.
 *
 * @param pairs - One or more `[from, to]` path pairs. Both must start with `/`.
 * @returns A Map where the key is the exact source pathname and the value is the target pathname.
 *
 * @example
 * const exact = buildExact(
 *   ["/posts", "/blog"],
 *   ["/about", "/company"],
 * );
 */
export function buildExact(
  ...pairs: ReadonlyArray<readonly [from: Pathname, to: Pathname]>
): ExactRules {
  return new Map(pairs);
}

/**
 * Builds a set of "gone" rules.
 *
 * Each argument is a pathname that should return **410 Gone** rather than redirect.
 *
 * @param goneUrls - One or more exact pathnames (must start with `/`).
 * @returns A Set of pathnames marked as gone.
 *
 * @example
 * const gone = buildGone(
 *   "/opengraph-image.jpg",
 *   "/projects/portfolio-web",
 * );
 */
export function buildGone(...goneUrls: ReadonlyArray<Pathname>): GoneRules {
  return new Set(goneUrls);
}

/**
 * Builds an ordered, readonly list of pattern-based rewrite/redirect rules.
 * The first matching rule wins — so order matters.
 *
 * @param rules - One or more pattern rules.
 * @returns A readonly array of pattern rules in the given order.
 *
 * @example
 * const pattern = buildPattern(
 *   {
 *     pattern: new URLPattern({ pathname: "/lab/:rest*" }),
 *     to: (m) => `/projects/lab/${m.pathname.groups.rest ?? ""}`,
 *   },
 * );
 */
export function buildPattern(
  ...rules: ReadonlyArray<PatternRule>
): PatternRules {
  return rules;
}
