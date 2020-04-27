import { Command } from './command';
import { DeckTypes } from '../../deck/deck-types';
import { AnswerColor } from '../answer-color';

/**
 * Command !useStandardDeck
 * Change the next deck to a standard deck
 */
export class UseStandardDeck extends Command {

  /**
   * Command !useStandardDeck
   * Change the next deck to a standard deck
   *
   * @inheritDoc
   */
  public run(params: string): void {
    this.logCommand('useStandardDeck', params);
    this.curGuild.getConfig().setDeckType(DeckTypes.standardDeck);
    this.saveGuildConfig();

    this.replyConfigChange('Use standard deck', 'changed the next deck to a standard deck (52 cards).');
  }

  /**
   * @inheritDoc
   */
  public help(): void {
    this.sendShortHelp(
      'Help UseStandardDeck',
      'Command to set config to use a standard (52 cards) deck. You have to shuffle to have the effect.');
  }
}
