import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Regression contract for the response headers served by Vercel.
// The obsolete browser XSS auditor is not a replacement for escaping or CSP.
const configuration = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8")) as {
  headers?: Array<{ source: string; headers: Array<{ key: string; value: string }> }>;
};

describe("Vercel response security headers", () => {
  it("disables obsolete XSS auditor and preserves baseline protections", () => {
    const headers = configuration.headers?.find((entry) => entry.source === "/(.*)")?.headers ?? [];
    const lookup = new Map(headers.map(({ key, value }) => [key.toLowerCase(), value]));

    expect(lookup.get("x-xss-protection")).toBe("0");
    expect(lookup.get("x-content-type-options")).toBe("nosniff");
    expect(lookup.get("x-frame-options")).toBe("DENY");
    expect(lookup.get("referrer-policy")).toBe("strict-origin-when-cross-origin");
  });
});
