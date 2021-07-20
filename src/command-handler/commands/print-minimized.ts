import { Command } from './command';
import { AnswerColor } from '../answer-color';

/**
 * Command !printMinimized
 * Print the answers short and minimized
 */
export class PrintMinimized extends Command {

  /**
   * @inheritDoc
   */
  public name: string[] = [ 'printMinimized', 'printminimized' ];

  /**
   * Command !printMinimized
   * Print the answers short and minimized
   *
   * @inheritDoc
   */
  public run(commandName: string, params: string): void {
    this.logCommand('printMinimized', commandName, params);
    this.curGuild.getConfig().printMinimized();
    this.saveGuildConfig();

    this.replyConfigChange('Minimize draw answers', 'minimized the draw answers.');
  }

  /**
   * @inheritDoc
   */
  public help(): void {
    this.setAuthor('Help Print Minimized', 'print-minimized');
    this.answer
      .setTitle('Print Minimized')
      .setColor(AnswerColor.info)
      .setDescription('Minimize all answers as short as possible with `printMinimized`. Multiple draw answers will be merged. Other answers will only be reactions.')
      .addField('Other Commands', 'You could also use `printminimized`.');
    this.sendAnswer();
  }
}
