import type { AppConfig, AppConfigOptions, Origin } from "./types";

/**
 * Creates an immutable application configuration object.
 *
 * Normalizes origin and path-handling options into a read-only structure
 * for consistent usage across the application.
 *
 * @param newOrigin - Base origin URL for the app (must start with http:// or https://).
 * @param options - Optional normalization settings.
 * @returns Read-only application configuration.
 *
 * @example
 * const config = createAppConfig("https://myapp.com", {
 *   normalizeLowerCasePath: true,
 *   normalizeTrailingSlash: "strip",
 * });
 *
 * // config.newOrigin === "https://myapp.com"
 * // config.options.normalizeTrailingSlash === "strip"
 */
export function createAppConfig(
  newOrigin: Origin,
  options?: AppConfigOptions,
): AppConfig {
  return {
    newOrigin,
    options: {
      normalizeLowerCasePath: options?.normalizeLowerCasePath ?? false,
      normalizeTrailingSlash: options?.normalizeTrailingSlash ?? "preserve",
    },
  };
}
