import { describe, expect, it } from "vitest";
import { parseCookies } from "../server/index";

describe("HTTP session cookies", () => {
  it("isolates invalid percent encodings without losing a valid session", () => {
    const cookies = parseCookies("broken=%ZZ; lf_session=signed.valid.token; another=x%20y");
    expect(cookies.lf_session).toBe("signed.valid.token");
    expect(cookies.another).toBe("x y");
    expect(cookies.broken).toBeUndefined();
  });

  it("does not inherit cookie names or mutate the object prototype", () => {
    const cookies = parseCookies("__proto__=polluted; constructor=anything; lf_session=abc");
    expect(Object.getPrototypeOf(cookies)).toBeNull();
    expect(cookies.lf_session).toBe("abc");
  });

  it("handles absent and empty cookies safely", () => {
    expect(Object.keys(parseCookies(undefined))).toEqual([]);
    expect(Object.keys(parseCookies(" ; = ;"))).toEqual([]);
  });
});
