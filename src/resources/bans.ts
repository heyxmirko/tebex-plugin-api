import type { Http, RequestOptions } from "../http";

export interface Ban {
  id: number;
  time: string;
  ip: string;
  payment_email: string;
  reason: string;
  user: { ign: string; uuid: string };
}

export interface CreateBanParams {
  user: string;
  reason?: string;
  ip?: string;
}

export class BansResource {
  constructor(private readonly http: Http) {}

  list(options?: RequestOptions): Promise<Ban[]> {
    return this.http.requestData("GET", "/bans", options);
  }

  create(params: CreateBanParams, options?: RequestOptions): Promise<Ban> {
    return this.http.requestData("POST", "/bans", { ...options, body: params });
  }
}
