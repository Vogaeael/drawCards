import { Command } from './command';
import { AnswerColor } from '../answer-color';

/**
 * Command !setPrefix
 * Set the new prefix
 */
export class SetPrefix extends Command {

  /**
   * Command !setPrefix
   * Set the new prefix
   *
   * @inheritDoc
   */
  public run(newPrefix: string): void {
    this.logCommand('setPrefix', newPrefix);
    if ('' === newPrefix) {
      newPrefix = '!';
    }
    this.curGuild.getConfig().setPrefix(newPrefix);
    this.saveGuildConfig();

    this.replyConfigChange('Prefix changed', 'changed prefix to ' + newPrefix + '.');
  }

  /**
   * @inheritDoc
   */
  public help(): void {
    this.sendShortHelp(
      'Help SetPrefix',
      'Command set a new prefix fo the commands. If no param is set, it will return to `!`.');
  }
}
