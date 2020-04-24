import { injectable } from 'inversify';
import { ICommand } from './commands/command';

export interface ICommandDeterminer {
  /**
   *
   * @param commands: Map<string, Command>, the map of commands
   * @param msg: string, the string to handle
   * @param prefix: string, the prefix of commands
   *
   * @return [Command, string]
   */
  handle(
    commands: Map<string, ICommand>,
    msg: string,
    prefix: string
  ): [ICommand, string]
}

@injectable()
export class CommandDeterminer implements ICommandDeterminer {
  private commands: Map<string, ICommand>;
  private curMsg: string;
  private guildPrefix: string;
  private command: ICommand;
  private params: string;

  /**
   * @inheritDoc
   */
  public handle(
    commands: Map<string, ICommand>,
    msg: string,
    prefix: string
  ): [ICommand, string] {
    this.setValues(commands, msg, prefix);

    if (!this.hasPrefix()) {
      return undefined;
    }
    this.removePrefix();

    if (!this.determineCommand()) {
      return undefined;
    }
    this.determineParams();

    return [this.command, this.params];
  }

  private setValues(
    commands: Map<string, ICommand>,
    msg: string,
    prefix: string
  ): void {
    this.commands = commands;
    this.curMsg = msg;
    this.guildPrefix = prefix;
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
