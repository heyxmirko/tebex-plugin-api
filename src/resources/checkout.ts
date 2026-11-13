import type { Http, RequestOptions } from "../http";

export interface CreateCheckoutParams {
  package_id: number | string;
  username: string;
}

export interface Checkout {
  url: string;
  expires: string;
}

export class CheckoutResource {
  constructor(private readonly http: Http) {}

  create(params: CreateCheckoutParams, options?: RequestOptions): Promise<Checkout> {
    return this.http.request("POST", "/checkout", { ...options, body: params });
  }
}
