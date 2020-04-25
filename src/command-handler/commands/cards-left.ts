import { Command } from './command';

/**
 * Command !cardsLeft
 * Get how many cards are remaining in the deck.
 */
export class CardsLeft extends Command {
  /**
   * Command !cardsLeft
   * Get how many cards are remaining in the deck.
   *
   * @inheritDoc
   */
  public run(params: string): void {
    this.replyConfigChange('Cards Left', this.curGuild.getDeck().count() + ' cards are left in the deck.');
  }
}
