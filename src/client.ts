import { Http, type TebexClientOptions } from "./http";
import {
  BansResource,
  CheckoutResource,
  CommunityGoalsResource,
  CouponsResource,
  GiftCardsResource,
  InformationResource,
  PackagesResource,
  PaymentsResource,
  PlayersResource,
  QueueResource,
  SalesResource,
} from "./resources";

export class TebexClient {
  readonly information: InformationResource;
  readonly communityGoals: CommunityGoalsResource;
  readonly payments: PaymentsResource;
  readonly packages: PackagesResource;
  readonly checkout: CheckoutResource;
  readonly giftCards: GiftCardsResource;
  readonly coupons: CouponsResource;
  readonly bans: BansResource;
  readonly sales: SalesResource;
  readonly players: PlayersResource;
  readonly queue: QueueResource;

  constructor(options: TebexClientOptions = {}) {
    const http = new Http(options);

    this.information = new InformationResource(http);
    this.communityGoals = new CommunityGoalsResource(http);
    this.payments = new PaymentsResource(http);
    this.packages = new PackagesResource(http);
    this.checkout = new CheckoutResource(http);
    this.giftCards = new GiftCardsResource(http);
    this.coupons = new CouponsResource(http);
    this.bans = new BansResource(http);
    this.sales = new SalesResource(http);
    this.players = new PlayersResource(http);
    this.queue = new QueueResource(http);
  }
}
