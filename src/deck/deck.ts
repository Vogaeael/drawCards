import { Suits } from './suits';
import { DeckTypes, Joker, StandardDeck, StrippedDeck } from './deck-types';
import { Card } from './card';

export class Deck {
  private cards: Card[];

  public constructor() {
    this.shuffle(DeckTypes.standardDeck);
  }

  /**
   * Refill the deck and shuffle the cards
   *
   * @param deckType: DeckTypes, which deck-type it will use
   * @param joker: boolean, if it should shuffle joker to the other cards
   */
  public shuffle(deckType: DeckTypes, joker: boolean = false): void {
    this._fill(deckType, joker);
    this._shuffle();
  }

  public draw(): Card {
    return this.cards.pop();
  }

  public count(): number {
    return this.cards.length;
  }

  /**
   * @param deckType: DeckTypes, the deck-type
   * @param joker: boolean, if there should be joker in the deck
   */
  private _fill(deckType: DeckTypes, joker: boolean = false): void {
    this.cards = [];

    this.addCards(deckType);
    if (joker) {
      this.addJoker();
    }
  }

  /**
   * @param deckType: DeckTypes, the deck-type to use
   */
  private addCards(deckType: DeckTypes): void {
    let deck: string[] = [];
    switch (deckType) {
      case DeckTypes.strippedDeck:
        deck = StrippedDeck;
        break;
      case DeckTypes.standardDeck:
        deck = StandardDeck;
        break;
    }

    Suits.forEach((suit: string) => {
      deck.forEach((rank: string) => {
        this.cards.push(new Card(suit, rank));
      });
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
