import { Hono } from "hono";
import { createAppConfig } from "./lib/config";
import * as rules from "./lib/rules";
import { createPathNormalizer } from "./lib/normalize";
import { createTargetUrlBuilder } from "./lib/buildUrl";
import { GONE, PERMANENT_REDIRECT } from "./lib/statuses";
import { createRedirectResolver } from "./lib/handler";

const config = createAppConfig("https://marekhonzal.com", {
  normalizeLowerCasePath: true,
  normalizeTrailingSlash: "strip",
});
const normalizePath = createPathNormalizer(config.options);
const buildTargetUrl = createTargetUrlBuilder(config.newOrigin);

const exactRules = rules.buildExact(["/posts", "/blog"]);

const goneRules = rules.buildGone(
  "/opengraph-image.jpg",
  "/projects/portfolio-web",
  "/projects/tickerdex",
  "/projects/guess-the-hex",
  "/projects/servicenow-incidents",
);

const patternRules = rules.buildPattern();

const resolve = createRedirectResolver({
  normalizePath,
  buildTargetUrl,
  exactRules,
  goneRules,
  patternRules,
  permanentCode: PERMANENT_REDIRECT,
});

const app = new Hono();

// Single catch-all
app.all("*", (c) => {
  const req = c.req.raw;
  const url = new URL(req.url);

  const result = resolve({ req, url });

  if (result.type === "gone") {
    return new Response(null, { status: GONE });
  }

  return Response.redirect(result.target, result.code);
});

export default app;
