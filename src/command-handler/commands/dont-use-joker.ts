import { Command } from './command';

/**
 * Command !dontUseJoker
 * Remove the joker from the next deck
 */
export class DontUseJoker extends Command {

  /**
   * @inheritDoc
   */
  public name: string = 'dontUseJoker';

  /**
   * Command !dontUseJoker
   * Remove the joker from the next deck
   *
   * @inheritDoc
   */
  public run(params: string): void {
    this.logCommand('dontUseJoker', params);
    this.curGuild.getConfig().dontUseJoker();
    this.saveGuildConfig();

    this.replyConfigChange('Don\'t use joker', 'removed joker from the next deck.')
  }

  /**
   * @inheritDoc
   */
  public help(): void {
    this.sendShortHelp(
      'Help DontUseJoker',
      'Command to add joker to the future decks. You have to shuffle to have a deck with joker.');
  }
}
