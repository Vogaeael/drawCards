import { Command } from './command';

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
    if ('' === newPrefix) {
      newPrefix = '!';
    }
    this.curGuild.getConfig().setPrefix(newPrefix);

    this.replyConfigChange('Prefix changed', 'changed prefix to ' + newPrefix + '.');
  }
}
