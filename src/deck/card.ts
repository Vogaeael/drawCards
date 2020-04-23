import { injectable } from 'inversify';

export interface ICard {
  /**
   * Initialize the values
   *
   * @param suit: string
   * @param rank: string
   */
  init(suit: string, rank: string): void,

  /**
   * Get the rank
   *
   * @return string
   */
  getRank(): string,

  /**
   * Get the suit
   *
   * @return string
   */
  getSuit(): string
}

@injectable()
export class Card implements ICard {
  private suit: string;
  private rank: string;

  /**
   * @inheritDoc
   */
  public init(suit: string, rank: string): void {
    this.suit = suit;
    this.rank = rank;
  }

  /**
   * @inheritDoc
   */
  public getRank(): string {
    return this.rank;
  }

  /**
   * @inheritDoc
   */
  public getSuit(): string {
    return this.suit;
  }
}
