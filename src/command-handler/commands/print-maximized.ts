import { Command } from './command';

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
    this.sendShortHelp(
      'Help PrintMaximized',
      'Command to set the config to maximise the answers.');
  }
}
