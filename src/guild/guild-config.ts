import { DeckTypes } from '../deck/deck-types';
import { injectable } from 'inversify';

@injectable()
export class GuildConfig {
  private prefix: string = '!';
  private joker: boolean = false;
  private deckType: DeckTypes = DeckTypes.standardDeck;

  public setPrefix(newPref: string): void {
    this.prefix = newPref;
  }

  public setJoker(joker: boolean): void {
    this.joker = joker;
  }

  public useJoker(): void {
    this.setJoker(true);
  }

  public dontUseJoker(): void {
    this.setJoker(false);
  }

  public setDeckType(ranksNum: DeckTypes): void {
    this.deckType = ranksNum;
  }

  public getPrefix(): string {
    return this.prefix;
  }

  public getJoker(): boolean {
    return this.joker;
  }

  public getDeckType(): DeckTypes {
    return this.deckType;
  }
}
