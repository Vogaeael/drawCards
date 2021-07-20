import { Command } from './command';
import { Loglevel } from '../../logger/logger-interface';
import { AnswerColor } from '../answer-color';

/**
 * Command !cardsLeft
 * Get how many cards are remaining in the deck.
 */
export class CardsLeft extends Command {
  /**
   * @inheritDoc
   */
  public name: string[] = [ 'cardsLeft', 'cardsleft', 'left' ];

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
    this.setAuthor('Help Cards Left', 'how-many-cards-are-remaining-in-the-deck');
    this.answer
      .setTitle('Cards Left')
      .setColor(AnswerColor.info)
      .setDescription('To know how many cards are left in the deck use `cardsLeft`.')
      .addField('Other Commands', 'You could also use `cardsleft` or `left`.');
    this.sendAnswer();
  }
}
