import { Command } from './command';

/**
 * Command !printMinimized
 * Print the answers short and minimized
 */
export class PrintMinimized extends Command {

  /**
   * Command !printMinimized
   * Print the answers short and minimized
   *
   * @inheritDoc
   */
  public run(params: string): void {
    this.curGuild.getConfig().printMinimized();

    this.replyConfigChange('Minimize draw answers', 'minimized the draw answers.');
  }
}
