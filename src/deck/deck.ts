import { Suits } from './suits';
import { DeckTypes, Joker, StandardDeck, StrippedDeck } from './deck-types';
import { ICard } from './card';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger, Loglevel } from '../logger/logger-interface';

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
  private logger: ILogger;

  public constructor(
    @inject(TYPES.CardFactory) cardFactory: () => ICard,//interfaces.Factory(Card) {,
    @inject(TYPES.Logger) logger: ILogger
  ) {
    this.logger = logger;
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

    let logMessage = 'refill ' + deckType;
    if (joker) {
      logMessage += ' with joker';
    }
    this.logger.log(Loglevel.DEBUG, logMessage);

    this.addCards(deckType);
    if (joker) {
      this.addJoker();
    }
  }

  /**
   * Add cards of stripped or standard deck to our deck
   *
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

    Object.keys(Suits)
      .filter((suit: string) => Suits[suit] !== Suits.joker)
      .forEach((suit: string) => {
        deck.forEach((rank: string) => {
          const card = this.cardFactory();
          card.init(Suits[suit], rank);
          this.cards.push(card);
        });
      });
  }

  /**
   * Add joker to the deck
   */
  private addJoker(): void {
    Object.entries(Joker).forEach((value: [string, string]) => {
      const card = this.cardFactory();
      card.init(Suits.joker, value[1]);
      this.cards.push(card);
    });
  }

  /**
   * Shuffle the deck
   */
  private _shuffle(): void {
    this.logger.log(Loglevel.DEBUG, 'shuffle deck');
    for (let i = this.cards.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
}
