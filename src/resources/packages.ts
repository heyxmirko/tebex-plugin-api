import { type Http, type RequestOptions, segment } from "../http";

export interface UpdatePackageParams {
  disabled?: boolean;
  name?: string;
  price?: number;
}

export class PackagesResource {
  constructor(private readonly http: Http) {}

  update(
    id: number | string,
    params: UpdatePackageParams,
    options?: RequestOptions,
  ): Promise<void> {
    return this.http.request("PUT", `/package/${segment(id)}`, { ...options, body: params });
  }
}
