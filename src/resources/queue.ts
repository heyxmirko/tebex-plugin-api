import { type Http, type RequestOptions, segment } from "../http";
import type { Player } from "../types";

export interface DueQueue {
  meta: {
    execute_offline: boolean;
    next_check: number;
    more: boolean;
  };
  players: Player[];
}

export interface OfflineCommand {
  id: number;
  command: string;
  payment: number;
  package: number;
  conditions: { delay: number };
  player: Player;
}

export interface OfflineCommands {
  meta: { limited: boolean };
  commands: OfflineCommand[];
}

export interface OnlineCommand {
  id: number;
  command: string;
  payment: number;
  package: number;
  conditions: { delay: number; slots: number };
}

export interface OnlineCommands {
  commands: OnlineCommand[];
}

export class QueueResource {
  constructor(private readonly http: Http) {}

  get(options?: RequestOptions): Promise<DueQueue> {
    return this.http.request("GET", "/queue", options);
  }

  offlineCommands(options?: RequestOptions): Promise<OfflineCommands> {
    return this.http.request("GET", "/queue/offline-commands", options);
  }

  onlineCommands(playerId: string | number, options?: RequestOptions): Promise<OnlineCommands> {
    return this.http.request("GET", `/queue/online-commands/${segment(playerId)}`, options);
  }

  delete(ids: number[], options?: RequestOptions): Promise<void> {
    return this.http.request("DELETE", "/queue", { ...options, body: { ids } });
  }
}
