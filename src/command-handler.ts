import { injectable } from 'inversify';

@injectable()
export class CommandHandler {
  private commands: Map<string, (string) => string>;
  private curMsg: string;
  private guildPrefix: string;
  private command: (string) => string;
  private params: string;

  public handle(
    commands: Map<string, (string) => string>,
    msg: string,
    prefix: string
  ): string {
    this.setValues(commands, msg, prefix);

    if (!this.hasPrefix()) {
      return undefined;
    }
    this.removePrefix();

    if (!this.determineCommand()) {
      return undefined;
    }
    this.determineParams();

    return this.command(this.params);
  }

  private setValues(
    commands: Map<string, (string) => string>,
    msg: string,
    prefix: string
  ): void {
    this.commands = commands;
    this.curMsg = msg;
    this.guildPrefix = prefix;
    this.command = (_: string) => { return undefined };
    this.params = '';
  }

  /**
   * Check if the message starts with the guild prefix
   *
   * @return boolean
   */
  private hasPrefix(): boolean {
    return this.curMsg.startsWith(this.guildPrefix);
  }

  private removePrefix(): void {
    this.curMsg = this.curMsg.replace(this.guildPrefix, '');
  }

  /**
   * Determines the command
   *
   * @return true if a valid command is found
   */
  private determineCommand(): boolean {
    /** @var command string */
    for (let command of this.commands.keys()) {
      if (this.curMsg.startsWith(command)) {
        this.curMsg = this.curMsg.replace(command, '');

        if (this.curMsg.length > 0) {
          if (!this.curMsg.startsWith(' ')) {
            return false;
          }

          this.curMsg = this.curMsg.replace(' ', '');
        }
        this.command = this.commands.get(command);

        return true;
      }
    }

    return false;
  }

  private determineParams(): void {
    this.params = this.curMsg;
  }
}
