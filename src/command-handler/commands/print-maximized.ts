import { Command } from './command';

/**
 * Command !printMaximized
 * Print the answers long and maximized
 */
export class PrintMaximized extends Command {

  /**
   * Command !printMaximized
   * Print the answers long and maximized
   *
   * @inheritDoc
   */
  public run(params: string): void {
    this.curGuild.getConfig().printMaximized();

    this.replyConfigChange('Maximized draw answers', 'maximized the draw answers.');
  }
}
