import { Command } from './command';

/**
 * Command !useJoker
 * Add joker to the next deck
 */
export class UseJoker extends Command {
  /**
   * @inheritDoc
   */
  public name: string[] = [ 'useJoker' ];

  /**
   * Command !useJoker
   * Add joker to the next deck
   *
   * @inheritDoc
   */
  public run(commandName: string, params: string): void {
    this.logCommand('useJoker', commandName, params);
    this.curGuild.getConfig().useJoker();
    this.saveGuildConfig();

    this.replyConfigChange('Use joker', 'added joker to the next deck.');
  }

  /**
   * @inheritDoc
   */
  public help(): void {
    this.sendShortHelp(
      'Help UseJoker',
      'Command to add joker to the next deck. You have to shuffle to make it effective.');
  }
}
