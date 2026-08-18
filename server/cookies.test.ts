import { describe, expect, it } from "vitest";
import { getSessionCookieOptions } from "./_core/cookies";

function requestWith(protocol: string, forwardedProto?: string) {
  return {
    protocol,
    headers: forwardedProto ? { "x-forwarded-proto": forwardedProto } : {},
  } as never;
}

describe("session cookie options", () => {
  it("uses secure SameSite=None for HTTPS", () => {
    expect(getSessionCookieOptions(requestWith("https"))).toMatchObject({
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
  });

  it("uses SameSite=Lax without secure transport locally", () => {
    expect(getSessionCookieOptions(requestWith("http"))).toMatchObject({
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
  });

  it("recognizes a trusted forwarded HTTPS scheme", () => {
    expect(
      getSessionCookieOptions(requestWith("http", "http, https"))
    ).toMatchObject({
      sameSite: "none",
      secure: true,
    });
  });
});
