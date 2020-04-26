import { Command } from './command';
import { Loglevel } from '../../logger/logger-interface';

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
    this.logCommand('dontUseJoker', params);
    this.curGuild.getConfig().dontUseJoker();
    this.saveGuildConfig();

    this.replyConfigChange('Don\'t use joker', 'removed joker from the next deck.')
  }
}
