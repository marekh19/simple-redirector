/**
 * Absolute pathname that always starts with a forward slash (`/`).
 *
 * Examples: "/", "/blog", "/projects/cool-api"
 *
 * This type prevents passing invalid values like "blog" or "http://example.com".
 */
export type Pathname = `/${string}`;

/** Base origin string. Must be a valid absolute URL origin (e.g. "https://example.com"). */
export type Origin = `${"http" | "https"}://${string}`;

/** Strategy for handling trailing slashes in pathnames. */
export type TrailingSlash = "preserve" | "strip" | "ensure";

/** Options for normalizing application paths. */
export interface AppConfigOptions {
  /** Whether to normalize all paths to lowercase. Default: `false`. */
  normalizeLowerCasePath?: boolean;

  /** Trailing slash handling strategy. Default: `"preserve"`. */
  normalizeTrailingSlash?: TrailingSlash;
}

/** Immutable application configuration. */
export type AppConfig = Readonly<{
  newOrigin: Origin;
  options: Required<AppConfigOptions>;
}>;

/** Map of exact redirects (from → to). */
export type ExactRules = Map<Pathname, Pathname>;

/** Set of pathnames that should return 410 Gone. */
export type GoneRules = Set<Pathname>;

/** A single pattern rule (first match wins). */
export type PatternRule = {
  /** URLPattern to match against the request URL. */
  pattern: URLPattern;
  /** Builds the target URL from the match and the original request. */
  to: (m: URLPatternResult, req: Request) => string;
};

/** Ordered list of pattern rules. */
export type PatternRules = readonly PatternRule[];

/** HTTP redirect codes your library may emit. */
export type RedirectCode = 301 | 302 | 303 | 307 | 308;

/** Result of resolving a redirect decision. */
export type ResolveResult =
  | { type: "gone" } // 410 Gone
  | { type: "redirect"; target: string; code: RedirectCode };

/** Dependencies needed by the redirect resolver (all pure). */
export type RedirectResolverDeps = Readonly<{
  /** Normalizes an absolute pathname (must start with '/'). */
  normalizePath: (p: Pathname) => Pathname;
  /** Builds absolute target URL on the new origin. */
  buildTargetUrl: (
    pathname: Pathname,
    opts?: { search?: string; hash?: string },
  ) => string;
  /** Exact redirects (from → to). */
  exactRules: ExactRules;
  /** Paths that should return 410 Gone. */
  goneRules: GoneRules;
  /** Ordered list of pattern rules (first match wins). */
  patternRules: readonly PatternRule[];
  /** Redirect code to use for permanent moves (e.g. 308). */
  permanentCode: RedirectCode;
}>;
