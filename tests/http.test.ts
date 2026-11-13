import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { TebexClient, TebexError } from "../src";
import { json, mockClient } from "./helpers";

afterEach(() => vi.unstubAllEnvs());

describe("secret", () => {
  it("reads TEBEX_SECRET when none is passed", () => {
    vi.stubEnv("TEBEX_SECRET", "from-env");
    expect(() => new TebexClient()).not.toThrow();
  });

  it("throws a helpful error when there is no secret", () => {
    vi.stubEnv("TEBEX_SECRET", "");
    expect(() => new TebexClient()).toThrow(/TEBEX_SECRET/);
  });
});

describe("requests", () => {
  it("sends the secret header to the right URL", async () => {
    const { tebex, lastRequest } = mockClient();
    await tebex.information.get();
    expect(lastRequest().url).toBe("https://plugin.tebex.io/information");
    expect(lastRequest().headers.get("X-Tebex-Secret")).toBe("test-secret");
  });

  it("omits undefined query params", async () => {
    const { tebex, lastRequest } = mockClient();
    await tebex.payments.list();
    expect(lastRequest().url).toBe("https://plugin.tebex.io/payments");
  });

  it("sends JSON bodies and handles empty responses", async () => {
    const { tebex, lastRequest } = mockClient(() => new Response(null, { status: 204 }));
    await expect(tebex.queue.delete([1, 2])).resolves.toBeUndefined();
    expect(await lastRequest().json()).toEqual({ ids: [1, 2] });
  });

  it("encodes path segments", async () => {
    const { tebex, lastRequest } = mockClient();
    await tebex.players.lookup("a b/c");
    expect(lastRequest().url).toBe("https://plugin.tebex.io/user/a%20b%2Fc");
  });

  it("times out", async () => {
    const hang = (_url: URL, init?: RequestInit) =>
      new Promise<Response>((_, reject) =>
        init?.signal?.addEventListener("abort", () => reject(init.signal?.reason)),
      );
    const tebex = new TebexClient({
      secret: "s",
      timeout: 10,
      fetch: hang as unknown as typeof fetch,
    });
    await expect(tebex.information.get()).rejects.toMatchObject({ name: "TimeoutError" });
  });
});

describe("errors", () => {
  it("throws TebexError with the API's error_message", async () => {
    const { tebex } = mockClient(() =>
      json({ error_code: 403, error_message: "Invalid secret" }, 403),
    );
    const error = await tebex.information.get().catch((e: unknown) => e);

    expect(error).toBeInstanceOf(TebexError);
    expect(error).toMatchObject({
      status: 403,
      code: 403,
      message: "Invalid secret",
      method: "GET",
      path: "/information",
    });
  });

  it("copes with non-JSON error bodies", async () => {
    const { tebex } = mockClient(() => new Response("<html>", { status: 502 }));
    await expect(tebex.information.get()).rejects.toMatchObject({ status: 502 });
  });
});
