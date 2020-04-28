import { inject, injectable } from 'inversify';
import { ICommand } from './commands/command';
import { TYPES } from '../types';
import { ILogger, Loglevel } from '../logger/logger-interface';
import { IBot, MessageToHandle } from '../bot';
import { ReplaySubject } from 'rxjs';
import { ICommandList } from './command-list';
import { IGuild } from '../guild/guild';
import { Message } from 'discord.js';

export interface CommandToHandle {
  command: ICommand,
  commandName: string,
  param: string,
  message: Message,
  guild: IGuild
}

export interface ICommandDeterminer {
  /**
   * Listen to the next command to handle
   *
   * @param next: (value: CommandToHandle) => void
   * @param error: (e) => void
   */
  listenToCommandToHandle(
    next: (value: CommandToHandle) => void,
    error: (e) => void): void
}

@injectable()
export class CommandDeterminer implements ICommandDeterminer {
  private readonly cmdList: ICommandList;
  private readonly logger: ILogger;
  private commandToHandle: ReplaySubject<CommandToHandle>;
  private curMsg: string;
  private guildPrefix: string;
  private commandName: string;
  private command: ICommand;
  private params: string;

  constructor(
    @inject(TYPES.Bot) bot: IBot,
    @inject(TYPES.Logger) logger: ILogger,
    @inject(TYPES.CommandList) cmdList: ICommandList,
    @inject(TYPES.ReplaySubjectFactory) replaySubjectFactory: <T>() => ReplaySubject<T>
  ) {
    this.commandToHandle = replaySubjectFactory<CommandToHandle>();
    this.logger = logger;
    this.cmdList = cmdList;
    this.listenToMessageToHandle(bot);
    this.logger.log(Loglevel.DEBUG, 'Constructed command-determiner');
  }

  /**
   * @inheritDoc
   */
  public listenToCommandToHandle(
    next: (value: CommandToHandle) => void,
    error: (e) => void
  ): void {
    this.commandToHandle.subscribe(next, error);
  }

  /**
   * Start listening to the MessageToHandle of the bot.
   *
   * @param bot: IBot
   */
  private listenToMessageToHandle(bot: IBot): void {
    bot.listenMessageToHandle((msg: MessageToHandle) => {
        this.logger.log(Loglevel.DEBUG, 'determine if \'' + msg.msg.content + '\' is a command with the prefix \'' + this.guildPrefix + '\'');
        this.curMsg = msg.msg.content;
        this.guildPrefix = msg.guild.getConfig().getPrefix();

        if (!this.hasPrefix()) {
          return
        }
        this.logger.log(Loglevel.DEBUG, 'Message \'' + msg.msg.content + '\' has the prefix \'' + this.guildPrefix + '\'');
        this.removePrefix();

        if (!this.determineCommand()) {
          return
        }
        this.logger.log(Loglevel.DEBUG, 'Message \'' + msg.msg.content + '\' is a command');
        this.determineParams();

        this.commandToHandle.next(
          {
            command: this.command,
            commandName: this.commandName,
            param: this.params,
            message: msg.msg,
            guild: msg.guild
          });
      },
      (e) => this.logger.log(Loglevel.FATAL, 'Error with Message to handle: ' + e));
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
    for (let command of this.cmdList.getNames()) {
      if (this.curMsg.startsWith(command)) {
        this.curMsg = this.curMsg.replace(command, '');
        this.commandName = command;

        if (this.curMsg.length > 0) {
          if (!this.curMsg.startsWith(' ')) {
            return false;
          }

          this.curMsg = this.curMsg.replace(' ', '');
        }
        this.command = this.cmdList.getCommand(command);

        return true;
      }
    }

    return false;
  }

  /**
   * Set the last of the message to the params
   */
  private determineParams(): void {
    this.params = this.curMsg;
  }
}
