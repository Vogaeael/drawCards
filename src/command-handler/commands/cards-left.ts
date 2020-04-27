import { Command } from './command';
import { Loglevel } from '../../logger/logger-interface';
import { AnswerColor } from '../answer-color';

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
    this.logCommand('cardsLeft', params);
    this.logger.log(Loglevel.DEBUG, 'Command: cardsLeft from guild ' + this.curGuild.getId());
    this.replyConfigChange(
      'Cards Left',
      this.curGuild.getDeck().count() + ' cards are left in the deck.',
      true);
  }

  /**
   * @inheritDoc
   */
  public help(): void {
    this.sendShortHelp(
      'Help CardsLeft',
      'Command to determine how many cards are left in the deck');
  }
}
