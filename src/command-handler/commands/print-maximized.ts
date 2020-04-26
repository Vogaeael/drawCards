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
    this.logCommand('printMaximized', params);
    this.curGuild.getConfig().printMaximized();
    this.saveGuildConfig();

    this.replyConfigChange('Maximized draw answers', 'maximized the draw answers.');
  }
}
