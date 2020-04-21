import { Suits } from './suits';
import { Ranks_52 } from './ranks';
import { Card } from './card';

export class Deck {
  private cards;

  public constructor() {
    this.shuffle();
  }

  public shuffle(): void {
    this._fill();
    this._shuffle();
  }

  private _fill(): void {
    this.cards = [];

    Object.entries(Suits).forEach((suit: [string, string]) => {
      Object.entries(Ranks_52).forEach((rank: [string, number]) => {
        this.cards.push(new Card(suit[0], rank[0]));
      })
    });
  }

  private _shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  public draw(): Card {
    return this.cards.pop();
  }

  public count(): number {
    return this.cards.length;
  }
}
