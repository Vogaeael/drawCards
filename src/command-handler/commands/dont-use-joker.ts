import { Command } from './command';
import { Loglevel } from '../../logger/logger-interface';
import { AnswerColor } from '../answer-color';

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

  /**
   * @inheritDoc
   */
  public help(): void {
    this.sendShortHelp(
      'Help DontUseJoker',
      'Command to add joker to the future decks. You have to shuffle to have a deck with joker.');
  }
}
