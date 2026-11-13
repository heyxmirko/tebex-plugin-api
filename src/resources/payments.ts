import { type Http, type RequestOptions, segment } from "../http";
import type { Currency, PackageRef, Page, Player } from "../types";

export type PaymentStatus = "Complete" | "Refund" | "Chargeback" | (string & {});

export interface Payment {
  id: number;
  amount: string;
  date: string;
  currency: Currency;
  status: PaymentStatus;
  player: Player;
  packages: PackageRef[];
  gateway?: { id: number; name: string };
  email?: string;
  notes?: { created_at: string; note: string }[];
  creator_code?: string | null;
}

export interface PaymentField {
  name: string;
  type: "numeric" | "dropdown" | "username" | (string & {});
  description?: string;
  value?: string;
  options?: false | { label: string; value: string | number }[];
}

export interface CreatePaymentParams {
  ign: string;
  price: number;
  packages: {
    id: number;
    options?: Record<string, string | number>;
  }[];
  note?: string;
}

export interface UpdatePaymentParams {
  username?: string;
  status?: "complete" | "chargeback" | "refund";
}

export class PaymentsResource {
  constructor(private readonly http: Http) {}

  list(query: { limit?: number } = {}, options?: RequestOptions): Promise<Payment[]> {
    return this.http.request("GET", "/payments", { ...options, query });
  }

  async listPaged(page = 1, options?: RequestOptions): Promise<Page<Payment>> {
    const response = await this.http.request<{
      data: Payment[];
      total: number;
      current_page: number;
      last_page: number;
      next_page_url: string | null;
    }>("GET", "/payments", { ...options, query: { paged: 1, page } });

    return {
      items: response.data,
      page: response.current_page,
      lastPage: response.last_page,
      total: response.total,
      hasNext: response.next_page_url !== null,
    };
  }

  get(transaction: string, options?: RequestOptions): Promise<Payment> {
    return this.http.request("GET", `/payments/${segment(transaction)}`, options);
  }

  requiredFields(packageId: number | string, options?: RequestOptions): Promise<PaymentField[]> {
    return this.http.request("GET", `/payments/fields/${segment(packageId)}`, options);
  }

  create(params: CreatePaymentParams, options?: RequestOptions): Promise<void> {
    return this.http.request("POST", "/payments", { ...options, body: params });
  }

  update(
    transaction: string,
    params: UpdatePaymentParams,
    options?: RequestOptions,
  ): Promise<void> {
    return this.http.request("PUT", `/payments/${segment(transaction)}`, {
      ...options,
      body: params,
    });
  }

  addNote(transaction: string, note: string, options?: RequestOptions): Promise<void> {
    return this.http.request("POST", `/payments/${segment(transaction)}/note`, {
      ...options,
      body: { note },
    });
  }
}
