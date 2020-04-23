import { Suits } from './suits';
import { DeckTypes, Joker, StandardDeck, StrippedDeck } from './deck-types';
import { ICard } from './card';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';

export interface IDeck {
  /**
   * Refill the deck and shuffle the cards
   *
   * @param deckType: DeckTypes, which deck-type it will use
   * @param joker: boolean, if it should shuffle joker to the other cards
   */
  shuffle(deckType: DeckTypes, joker: boolean): void,

  /**
   * Draw a card
   *
   * @return ICard
   */
  draw(): ICard,

  /**
   * Count the number of remaining cards
   *
   * @return number
   */
  count(): number,
}

@injectable()
export class Deck implements IDeck {
  private cards: ICard[];
  private readonly cardFactory: () => ICard;

  public constructor(
    @inject(TYPES.CardFactory) cardFactory: () => ICard//interfaces.Factory(Card) {
  ) {
    this.cardFactory = cardFactory;
    this.shuffle(DeckTypes.standardDeck);
  }

  /**
   * @inheritDoc
   */
  public shuffle(deckType: DeckTypes, joker: boolean = false): void {
    this._fill(deckType, joker);
    this._shuffle();
  }

  /**
   * @inheritDoc
   */
  public draw(): ICard {
    return this.cards.pop();
  }

  /**
   * @inheritDoc
   */
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

    Object.keys(Suits).forEach((suit: string) => {
      deck.forEach((rank: string) => {
        const card = this.cardFactory();
        card.init(suit, rank);
        this.cards.push(card);
      });
    });
  }

  private addJoker(): void {
    Object.entries(Joker).forEach((value: [string, string]) => {
      const card = this.cardFactory();
      card.init('', value[1]);
      this.cards.push(card);
    });
  }

  private _shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
}
