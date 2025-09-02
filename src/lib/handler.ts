import type { Pathname, RedirectResolverDeps, ResolveResult } from "./types";

/**
 * Creates a pure redirect resolver that implements the library flow:
 * 1) 410 Gone → `gone`
 * 2) Exact map → redirect
 * 3) First matching pattern → redirect
 * 4) Fallback to same path on new origin → redirect
 */
export function createRedirectResolver(deps: RedirectResolverDeps) {
  const {
    normalizePath,
    buildTargetUrl,
    exactRules,
    goneRules,
    patternRules,
    permanentCode,
  } = deps;

  return (input: { url: URL; req: Request }): ResolveResult => {
    const { url, req } = input;
    const { hash, search } = url;
    const normalized = normalizePath(url.pathname as Pathname);

    // 1) 410 Gone
    if (goneRules.has(normalized)) {
      return { type: "gone" };
    }

    // 2) Exact map
    const exact = exactRules.get(normalized);
    if (exact) {
      const target = buildTargetUrl(exact, { search, hash });
      return { type: "redirect", target, code: permanentCode };
    }

    // 3) Pattern rules (first match wins)
    for (const rule of patternRules) {
      const match = rule.pattern.exec(url);
      if (match) {
        // Ensure your rule.to returns a *pathname* (starting with "/").
        const to = rule.to(match, req) as Pathname;
        const target = buildTargetUrl(to, { search, hash });
        return { type: "redirect", target, code: permanentCode };
      }
    }

    // 4) Default: same path on new origin
    const target = buildTargetUrl(normalized, { search, hash });
    return { type: "redirect", target, code: permanentCode };
  };
}
