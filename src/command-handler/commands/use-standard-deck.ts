import { Command } from './command';
import { DeckTypes } from '../../deck/deck-types';

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
    this.curGuild.getConfig().setDeckType(DeckTypes.standardDeck);
    this.saveGuildConfig();

    this.replyConfigChange('Use standard deck', 'changed the next deck to a standard deck (52 cards).');
  }
}
