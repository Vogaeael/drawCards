import { Command } from './command';
import { DeckTypes } from '../../deck/deck-types';

/**
 * Command !useStrippedDeck
 * Change the next deck to a stripped deck
 */
export class UseStrippedDeck extends Command {
  /**
   * @inheritDoc
   */
  public name: string = 'useStrippedDeck';

  /**
   * Command !useStrippedDeck
   * Change the next deck to a stripped deck
   *
   * @inheritDoc
   */
  public run(params: string): void {
    this.logCommand('useStrippedDeck', params);
    this.curGuild.getConfig().setDeckType(DeckTypes.strippedDeck);
    this.saveGuildConfig();

    this.replyConfigChange('Use stripped deck', 'changed the next deck to a stripped deck (32 cards).');
  }

  /**
   * @inheritDoc
   */
  public help(): void {
    this.sendShortHelp(
      'Help UseStrippedDeck',
      'Command to set config to use a stripped (32 cards) deck. You have to shuffle to have the effect.');
  }
}
