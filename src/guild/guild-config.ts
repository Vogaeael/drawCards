import { DeckTypes } from '../deck/deck-types';
import { injectable } from 'inversify';

export interface IGuildConfig {
  /**
   * Set the command prefix
   *
   * @param newPref: string
   */
  setPrefix(newPref: string): void,

  /**
   * Add joker to the deck
   */
  useJoker(): void,

  /**
   * Remove joker from the deck
   */
  dontUseJoker(): void,

  /**
   * Set the type of deck
   *
   * @param deckType: DeckTypes
   */
  setDeckType(deckType: DeckTypes): void

  /**
   * Set that the answers should be printed minimized and short.
   */
  printMinimized(): void,

  /**
   * Set that the answers should be printed maximized and long.
   */
  printMaximized(): void,

  /**
   * Get the command prefix
   *
   * @return string
   */
  getPrefix(): string,

  /**
   * Get if joker should be in the deck
   *
   * @return boolean
   */
  getJoker(): boolean,

  /**
   * Get the current deck type
   *
   * @return DeckTypes
   */
  getDeckType(): DeckTypes,

  /**
   * Get if answers should be minimized
   *
   * @return boolean
   */
  getMinimized(): boolean
}

@injectable()
export class GuildConfig implements IGuildConfig {
  private prefix: string = '!';
  private joker: boolean = false;
  private minimized: boolean = true;
  private deckType: DeckTypes = DeckTypes.standardDeck;

  /**
   * @inheritDoc
   */
  public setPrefix(newPref: string): void {
    this.prefix = newPref;
  }

  /**
   * @inheritDoc
   */
  public useJoker(): void {
    this.joker = true;
  }

  /**
   * @inheritDoc
   */
  public dontUseJoker(): void {
    this.joker = false;
  }

  /**
   * @inheritDoc
   */
  public setDeckType(deckType: DeckTypes): void {
    this.deckType = deckType;
  }

  /**
   * @inheritDoc
   */
  public printMinimized(): void {
    this.minimized = true;
  }

  /**
   * @inheritDoc
   */
  public printMaximized(): void {
    this.minimized = false;
  }

  /**
   * @inheritDoc
   */
  public getPrefix(): string {
    return this.prefix;
  }

  /**
   * @inheritDoc
   */
  public getJoker(): boolean {
    return this.joker;
  }

  /**
   * @inheritDoc
   */
  public getDeckType(): DeckTypes {
    return this.deckType;
  }

  /**
   * @inheritDoc
   */
  public getMinimized(): boolean {
    return this.minimized;
  }
}