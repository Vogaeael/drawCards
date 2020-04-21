import { Suits } from './suits';
import { Joker, StandardDeck } from './deck-types';
import { Card } from './card';

export class Deck {
  private cards: Card[];

  public constructor() {
    this.shuffle();
  }

  /**
   * Refill the deck and shuffle the cards
   *
   * @param joker: boolean, if it should shuffle joker to the other cards
   */
  public shuffle(joker: boolean = false): void {
    this._fill(joker);
    this._shuffle();
  }

  public draw(): Card {
    return this.cards.pop();
  }

  public count(): number {
    return this.cards.length;
  }

  /**
   * @param joker: boolean, if there should be joker in the deck
   */
  private _fill(joker: boolean = false): void {
    this.cards = [];

    this.addCards();
    if (joker) {
      this.addJoker();
    }
  }

  private addCards(): void {
    Object.entries(Suits).forEach((suit: [string, string]) => {
      Object.entries(StandardDeck).forEach((rank: [string, number]) => {
        this.cards.push(new Card(suit[0], rank[0]));
      })
    });
  }

  private addJoker(): void {
    Object.entries(Joker).forEach(() => {
      this.cards.push(new Card('black_joker', ''));
    });
  }

  private _shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
}
