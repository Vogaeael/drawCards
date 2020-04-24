import { Command } from './command';

/**
 * Command !useJoker
 * Add joker to the next deck
 */
export class UseJoker extends Command {

  /**
   * Command !useJoker
   * Add joker to the next deck
   *
   * @inheritDoc
   */
  public run(params: string): void {
    this.curGuild.getConfig().useJoker();

    this.replyConfigChange('Use joker', 'added joker to the next deck.');
  }
}
