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
    this.logCommand('printMinimized', params);
    this.curGuild.getConfig().printMinimized();
    this.saveGuildConfig();

    this.replyConfigChange('Minimize draw answers', 'minimized the draw answers.');
  }
}
