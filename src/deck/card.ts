import { injectable } from 'inversify';

@injectable()
export class Card {
  private suit: string;
  private rank: string;

  public init(suit: string, rank: string) {
    this.suit = suit;
    this.rank = rank;
  }

  public getRank(): string {
    return this.rank;
  }

  public getSuit(): string {
    return this.suit;
  }
}
