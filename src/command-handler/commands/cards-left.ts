import { Command } from './command';
import { Loglevel } from '../../logger/logger-interface';

/**
 * Command !cardsLeft
 * Get how many cards are remaining in the deck.
 */
export class CardsLeft extends Command {
  /**
   * @inheritDoc
   */
  public static readonly names: string[] = [ 'cardsLeft', 'left' ];

  /**
   * Command !cardsLeft
   * Get how many cards are remaining in the deck.
   *
   * @inheritDoc
   */
  public run(commandName: string, params: string): void {
    this.logCommand('cardsLeft', commandName, params);
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
      'Command to determine how many cards are left in the deck. Instead of `cardsLeft` you can use `left`');
  }
}
