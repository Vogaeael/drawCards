import { injectable } from 'inversify';
import { Suits } from './suits';

export interface ICard {
  /**
   * Initialize the values
   *
   * @param suit: string
   * @param rank: string
   */
  init(suit: Suits, rank: string): void,

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
  getSuit(): Suits
}

@injectable()
export class Card implements ICard {
  private suit: Suits;
  private rank: string;

  /**
   * @inheritDoc
   */
  public init(suit: Suits, rank: string): void {
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
  public getSuit(): Suits {
    return this.suit;
  }
}
