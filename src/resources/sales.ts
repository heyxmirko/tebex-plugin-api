import type { Http, RequestOptions } from "../http";

export interface Sale {
  id: number;
  name: string;
  effective: {
    type: "package" | "category" | (string & {});
    packages: number[];
    categories: number[];
  };
  discount: {
    type: "percentage" | "value";
    percentage: number;
    value: number;
  };
  start: number;
  expire: number;
  order: number;
}

export class SalesResource {
  constructor(private readonly http: Http) {}

  list(options?: RequestOptions): Promise<Sale[]> {
    return this.http.requestData("GET", "/sales", options);
  }
}
