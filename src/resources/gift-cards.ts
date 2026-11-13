import { type Http, type RequestOptions, segment } from "../http";

export interface GiftCard {
  id: number;
  code: string;
  balance: {
    starting: string;
    remaining: string;
    currency: string;
  };
  note: string;
  void: boolean;
}

export interface CreateGiftCardParams {
  amount: number;
  note?: string;
  expires_at?: string;
}

export class GiftCardsResource {
  constructor(private readonly http: Http) {}

  list(options?: RequestOptions): Promise<GiftCard[]> {
    return this.http.requestData("GET", "/gift-cards", options);
  }

  get(id: number | string, options?: RequestOptions): Promise<GiftCard> {
    return this.http.requestData("GET", `/gift-cards/${segment(id)}`, options);
  }

  lookup(code: string, options?: RequestOptions): Promise<GiftCard> {
    return this.http.requestData("GET", `/gift-cards/lookup/${segment(code)}`, options);
  }

  create(params: CreateGiftCardParams, options?: RequestOptions): Promise<GiftCard> {
    return this.http.requestData("POST", "/gift-cards", { ...options, body: params });
  }

  topUp(id: number | string, amount: number, options?: RequestOptions): Promise<GiftCard> {
    return this.http.requestData("PUT", `/gift-cards/${segment(id)}`, {
      ...options,
      body: { amount: String(amount) },
    });
  }

  void(id: number | string, options?: RequestOptions): Promise<GiftCard> {
    return this.http.requestData("DELETE", `/gift-cards/${segment(id)}`, options);
  }
}
