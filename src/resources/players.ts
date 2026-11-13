import { type Http, type RequestOptions, segment } from "../http";
import type { PackageRef } from "../types";

export interface PlayerLookup {
  player: {
    id: string;
    username: string;
    meta: string;
    plugin_username_id: number;
  };
  banCount: number;
  chargebackRate: number;
  payments: {
    txn_id: string;
    time: number;
    price: number;
    currency: string;
    status: number;
  }[];
  purchaseTotals: Record<string, number>;
}

export interface ActivePackage {
  txn_id: string;
  date: string;
  quantity: number;
  package: PackageRef;
}

export class PlayersResource {
  constructor(private readonly http: Http) {}

  lookup(user: string, options?: RequestOptions): Promise<PlayerLookup> {
    return this.http.request("GET", `/user/${segment(user)}`, options);
  }

  activePackages(
    playerId: number | string,
    query: { package?: number } = {},
    options?: RequestOptions,
  ): Promise<ActivePackage[]> {
    return this.http.request("GET", `/player/${segment(playerId)}/packages`, {
      ...options,
      query,
    });
  }
}
