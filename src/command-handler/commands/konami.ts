import { Command, ICommand } from './command';
import { Loglevel } from '../../logger/logger-interface';

export class Konami extends Command {
  /**
   * @inheritDoc
   */
  public name: string[] = [ "⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️🅱️🅰️" ];

  /**
   * Command !
   *
   * @inheritDoc
   */
  public run(commandName: string, params: string): void {
    this.logCommand('konami', commandName, params);
    this.msg.reply('Okay, I show you a trick 😉, pull a card (command: pullCard)')
      .catch((e) => this.logger.log(Loglevel.ERROR, e));
  }

  public konami(params: string): void {
    this.msg.reply('Okay, I show you a trick 😉, pull a card (command: pullCard)')
      .catch((e) => this.logger.log(Loglevel.ERROR, e));
  }

  /**
   * @inheritDoc
   */
  public help(): void {
    const help: ICommand = this.cmdList.getCommand('help');
    if (help) {
      help.help();
    }
    // No help for this easter egg
  }
}
