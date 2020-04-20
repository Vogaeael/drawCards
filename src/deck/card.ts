export class Card {
  private readonly suit;
  private readonly rank;

  public constructor(suit: string, rank: string) {
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
