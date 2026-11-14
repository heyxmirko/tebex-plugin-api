# tebex-plugin-api

[![npm](https://img.shields.io/npm/v/tebex-plugin-api)](https://www.npmjs.com/package/tebex-plugin-api)
[![CI](https://github.com/heyxmirko/tebex-plugin-api/actions/workflows/ci.yml/badge.svg)](https://github.com/heyxmirko/tebex-plugin-api/actions/workflows/ci.yml)

Unofficial, fully typed TypeScript SDK for the [Tebex Plugin API](https://docs.tebex.io/plugin) (also called the Game Server API).
Zero dependencies. Node 22+, Bun, Deno and edge runtimes.

Having to repeatedly write the same API calls for things like coupons, gift cards, and payments as part of commission work made me create this SDK to make things easier.

> **Server-side only.** Your secret key gives access to private store data. Call this from your backend and only return what's safe to show.

## Install

```sh
npm install tebex-plugin-api
```

## Usage

Get your secret key at [creator.tebex.io/game-servers](https://creator.tebex.io/game-servers) and set it as `TEBEX_SECRET`:

```ts
import { TebexClient } from "tebex-plugin-api";

const tebex = new TebexClient(); // reads TEBEX_SECRET (or pass { secret })

const goals = await tebex.communityGoals.list();
const payments = await tebex.payments.list({ limit: 10 });
```

## Recipes

**Create a coupon**

```ts
const coupon = await tebex.coupons.create({
  code: "SUMMER25",
  effective_on: "cart",
  discount_type: "percentage",
  discount_percentage: 25,
  redeem_unlimited: true,
  expire_never: false,
  expire_date: "2026-09-01",
  start_date: "2026-06-01",
  basket_type: "single",
});
```

**Issue and top up a gift card**

```ts
const card = await tebex.giftCards.create({ amount: 25, note: "Giveaway winner" });
await tebex.giftCards.topUp(card.id, 10);
```

**Create a manual payment**

```ts
const fields = await tebex.payments.requiredFields(1234); // option fields the package needs

await tebex.payments.create({
  ign: "Notch",
  price: 0,
  packages: [{ id: 1234 }],
  note: "Compensation",
});
```

**Loop through every payment**

```ts
let page = 1;
while (true) {
  const result = await tebex.payments.listPaged(page++);
  for (const payment of result.items) console.log(payment.id, payment.amount);
  if (!result.hasNext) break;
}
```

**Handle errors**

```ts
import { TebexError } from "tebex-plugin-api";

try {
  await tebex.giftCards.lookup("0000");
} catch (error) {
  if (error instanceof TebexError) console.error(error.status, error.message);
  else throw error;
}
```

## Good to know

- **Resources:** `information`, `communityGoals`, `payments`, `coupons`, `giftCards`, `bans`, `sales`, `players`, `checkout`, `packages`, `queue`.
- **Types match the API exactly** (snake_case, money as strings). Nothing is renamed.
- **Responses are tidied up:** `{ data }` wrappers are removed, and paginated endpoints return `{ items, page, lastPage, total, hasNext }`.
- **Payments include customer emails.** Don't send them to the browser.
- **Rate limit:** 500 requests per 5 minutes per secret. There are no automatic retries, so cache results in your app.
- **Timeouts and cancelling:** requests time out after 10s (`timeout` option), and every method accepts `{ signal }` as its last argument.
- **Listings and package reads** are deprecated by Tebex. Use the [Headless API](https://docs.tebex.io/developers/headless-api/introduction) for those.

## License

MIT
