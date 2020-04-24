import { Command } from './command';

/**
 * Command !dontUseJoker
 * Remove the joker from the next deck
 */
export class DontUseJoker extends Command {

  /**
   * Command !dontUseJoker
   * Remove the joker from the next deck
   *
   * @inheritDoc
   */
  public run(params: string): void {
    this.curGuild.getConfig().dontUseJoker();

    this.replyConfigChange('Don\'t use joker', 'removed joker from the next deck.')
  }
}
