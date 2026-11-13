import { describe, expect, it } from "vite-plus/test";
import { json, mockClient } from "./helpers";

describe("resources", () => {
  it("unwraps `data` envelopes", async () => {
    const card = { id: 1, code: "abc" };
    const { tebex } = mockClient(() => json({ data: [card] }));
    expect(await tebex.giftCards.list()).toEqual([card]);
  });

  it("normalises paginated payments", async () => {
    const { tebex, lastRequest } = mockClient(() =>
      json({
        total: 50,
        per_page: 25,
        current_page: 1,
        last_page: 2,
        next_page_url: "https://plugin.tebex.io/payments?page=2",
        data: [{ id: 1 }],
      }),
    );

    expect(await tebex.payments.listPaged()).toEqual({
      items: [{ id: 1 }],
      page: 1,
      lastPage: 2,
      total: 50,
      hasNext: true,
    });
    expect(lastRequest().url).toBe("https://plugin.tebex.io/payments?paged=1&page=1");
  });

  it("normalises paginated coupons", async () => {
    const { tebex } = mockClient(() =>
      json({
        pagination: { totalResults: 1, currentPage: 1, lastPage: 1, next: null },
        data: [{ id: 2 }],
      }),
    );
    expect(await tebex.coupons.list()).toMatchObject({ total: 1, hasNext: false });
  });

  it("sends gift card top-ups as a string amount", async () => {
    const { tebex, lastRequest } = mockClient(() => json({ data: {} }));
    await tebex.giftCards.topUp(7, 10);
    expect(lastRequest().method).toBe("PUT");
    expect(await lastRequest().json()).toEqual({ amount: "10" });
  });
});
