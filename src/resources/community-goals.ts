import { type Http, type RequestOptions, segment } from "../http";

export interface CommunityGoal {
  id: number;
  created_at: string;
  updated_at: string;
  account: number;
  name: string;
  description: string;
  image: string;
  target: string;
  current: string;
  repeatable: number;
  last_achieved: string | null;
  times_achieved: number;
  status: "active" | (string & {});
  sale: number;
}

export class CommunityGoalsResource {
  constructor(private readonly http: Http) {}

  list(options?: RequestOptions): Promise<CommunityGoal[]> {
    return this.http.request("GET", "/community_goals", options);
  }

  get(id: number | string, options?: RequestOptions): Promise<CommunityGoal> {
    return this.http.request("GET", `/community_goals/${segment(id)}`, options);
  }
}
