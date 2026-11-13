import type { Http, RequestOptions } from "../http";
import type { Currency } from "../types";

export interface ServerInformation {
  account: {
    id: number;
    domain: string;
    name: string;
    currency: Currency;
    online_mode: boolean;
    game_type: string;
    log_events: boolean;
  };
  server: { id: number; name: string };
}

export class InformationResource {
  constructor(private readonly http: Http) {}

  get(options?: RequestOptions): Promise<ServerInformation> {
    return this.http.request("GET", "/information", options);
  }
}
