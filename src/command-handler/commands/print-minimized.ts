import { Command } from './command';

/**
 * Command !printMinimized
 * Print the answers short and minimized
 */
export class PrintMinimized extends Command {

  /**
   * @inheritDoc
   */
  public name: string[] = [ 'printMinimized' ];

  /**
   * Command !printMinimized
   * Print the answers short and minimized
   *
   * @inheritDoc
   */
  public run(commandName: string, params: string): void {
    this.logCommand('printMinimized', params);
    this.curGuild.getConfig().printMinimized();
    this.saveGuildConfig();

    this.replyConfigChange('Minimize draw answers', 'minimized the draw answers.');
  }

  /**
   * @inheritDoc
   */
  public help(): void {
    this.sendShortHelp(
      'Help PrintMinimized',
      'Command to minimize the answers. Multiple draw answers will be merged.');
  }
}
