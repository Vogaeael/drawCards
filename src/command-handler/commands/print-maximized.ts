import { Command } from './command';
import { AnswerColor } from '../answer-color';

/**
 * Command !printMaximized
 * Print the answers long and maximized
 */
export class PrintMaximized extends Command {

  /**
   * @inheritDoc
   */
  public name: string[] = [ 'printMaximized', 'printmaximized' ];

  /**
   * Command !printMaximized
   * Print the answers long and maximized
   *
   * @inheritDoc
   */
  public run(commandName: string, params: string): void {
    this.logCommand('printMaximized', commandName, params);
    this.curGuild.getConfig().printMaximized();
    this.saveGuildConfig();

    this.replyConfigChange('Maximized draw answers', 'maximized the draw answers.');
  }

  /**
   * @inheritDoc
   */
  public help(): void {
    this.setAuthor('Help Print Maximized', 'print-maximized');
    this.answer
      .setTitle('Print Maximized')
      .setColor(AnswerColor.info)
      .setDescription('Maximize all answers with `printMaximized`. Every drawn card will be it\'s own message. Answers will not be reactions any more.')
      .addField('Other Commands', 'You could also use `printmaximized`.');
    this.sendAnswer();
  }
}
