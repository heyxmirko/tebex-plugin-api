import { vi } from "vite-plus/test";
import { TebexClient } from "../src";

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export function mockClient(respond: (request: Request) => Response = () => json({})) {
  const fetch = vi.fn(async (input: URL, init?: RequestInit) => respond(new Request(input, init)));
  const tebex = new TebexClient({
    secret: "test-secret",
    fetch: fetch as unknown as typeof globalThis.fetch,
  });
  const lastRequest = () => {
    const [input, init] = fetch.mock.lastCall!;
    return new Request(input, init);
  };
  return { tebex, fetch, lastRequest };
}
