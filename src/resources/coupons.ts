import { type Http, type RequestOptions, segment } from "../http";
import type { Page } from "../types";

type BoolString = boolean | "true" | "false";

export interface Coupon {
  id: number;
  code: string;
  effective: {
    type: "cart" | "package" | "category";
    packages: number[];
    categories: number[];
  };
  discount: {
    type: "value" | "percentage";
    percentage: number;
    value: number;
  };
  expire: {
    redeem_unlimited: BoolString;
    expire_never: BoolString;
    limit: number;
    date: string;
  };
  basket_type: "single" | "subscription" | "both";
  start_date: string;
  user_limit: number;
  minimum: number;
  discount_application_method?: number;
  username: string;
  note: string;
}

type Discount =
  | { discount_type: "percentage"; discount_percentage: number }
  | { discount_type: "value"; discount_amount: number };

type Target =
  | { effective_on: "cart" }
  | { effective_on: "package"; packages: number[] }
  | { effective_on: "category"; categories: number[] };

export type CreateCouponParams = Discount &
  Target & {
    code: string;
    redeem_unlimited: boolean;
    expire_limit?: number;
    expire_never: boolean;
    expire_date?: string;
    start_date: string;
    basket_type: "single" | "subscription" | "both";
    minimum?: number;
    discount_application_method?: 0 | 1 | 2;
    username?: string;
    note?: string;
  };

export class CouponsResource {
  constructor(private readonly http: Http) {}

  async list(page?: number, options?: RequestOptions): Promise<Page<Coupon>> {
    const response = await this.http.request<{
      data: Coupon[];
      pagination: {
        totalResults: number;
        currentPage: number;
        lastPage: number;
        next: string | null;
      };
    }>("GET", "/coupons", { ...options, query: { page } });

    return {
      items: response.data,
      page: response.pagination.currentPage,
      lastPage: response.pagination.lastPage,
      total: response.pagination.totalResults,
      hasNext: response.pagination.next !== null,
    };
  }

  get(id: number | string, options?: RequestOptions): Promise<Coupon> {
    return this.http.requestData("GET", `/coupons/${segment(id)}`, options);
  }

  create(params: CreateCouponParams, options?: RequestOptions): Promise<Coupon> {
    return this.http.requestData("POST", "/coupons", { ...options, body: params });
  }

  delete(id: number | string, options?: RequestOptions): Promise<void> {
    return this.http.request("DELETE", `/coupons/${segment(id)}`, options);
  }
}
