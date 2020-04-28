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
  public run(params: string): void {
    this.logCommand('konami', params);
    this.msg.reply('You little cheater 😉')
      .catch((e) => this.logger.log(Loglevel.ERROR, e));
  }

  /**
   * @inheritDoc
   */
  public help(): void {
    const help: ICommand = this.cmdHandler.getCommand('help');
    if (help) {
      help.help();
    }
    // No help for this easter egg
  }
}
