import { Command } from './command';
import { AnswerColor } from '../answer-color';

/**
 * Command !setPrefix
 * Set the new prefix
 */
export class SetPrefix extends Command {
  /**
   * @inheritDoc
   */
  public name: string[] = [ 'setPrefix', 'setprefix' ];

  /**
   * Command !setPrefix
   * Set the new prefix
   *
   * @inheritDoc
   */
  public run(commandName: string, newPrefix: string): void {
    this.logCommand('setPrefix', commandName, newPrefix);
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
    this.setAuthor('Help Set Prefix', 'set-prefix');
    this.answer
      .setTitle('Set Prefix')
      .setColor(AnswerColor.info)
      .setDescription('Set a new Prefix with `setPrefix [?prefix]`. The default prefix is `!`.')
      .addField('Param [?prefix]', 'The Param prefix is to define the new prefix. If you don\'t add that param, the prefix will be set back to default.')
      .addField('Other Commands', 'You could also use `setprefix`.')
      .addField('Examples', 'Here you can see some examples:\n' +
        '```\n' +
        'setPrefix bob  # change the prefix to bob => `bobdraw` would be the new `draw`\n' +
        'setprefix 4    # change the prefix to 4 => `4draw` would be the new `draw`\n' +
        'setPrefix      # without parameter it changes back to `!`\n' +
        '```');
    this.sendAnswer();
  }
}
