import { Command } from './command';
import { DeckTypes } from '../../deck/deck-types';

/**
 * Command !useStrippedDeck
 * Change the next deck to a stripped deck
 */
export class UseStrippedDeck extends Command {

  /**
   * Command !useStrippedDeck
   * Change the next deck to a stripped deck
   *
   * @inheritDoc
   */
  public run(params: string): void {
    this.curGuild.getConfig().setDeckType(DeckTypes.strippedDeck);
    this.saveGuildConfig();

    this.replyConfigChange('Use stripped deck', 'changed the next deck to a stripped deck (32 cards).');
  }
}
