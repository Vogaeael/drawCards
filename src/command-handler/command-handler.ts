import { inject, injectable } from 'inversify';
import { IGuild } from '../guild/guild';
import { Message, MessageEmbed } from 'discord.js';
import { ICommandDeterminer } from './command-determiner';
import { TYPES } from '../types';
import { ICommand, ICommandClass } from './commands/command';
import { lowerFirstChar } from '../functions';
import { IDatabaseApi } from '../database/database-api';
import { ILogger, Loglevel } from '../logger/logger-interface';

export interface ICommandHandler {
  /**
   * Handle the message
   *
   * @param msg
   * @param curGuild
   */
  handle(
    msg: Message,
    curGuild: IGuild
  ): void,

  /**
   * Add commands to the command list
   *
   * @param classList
   */
  addCommands(classList): void,
}

@injectable()
export class CommandHandler implements ICommandHandler {
  private readonly cmdDeterminer: ICommandDeterminer;
  private readonly msgFactory: () => MessageEmbed;
  private readonly databaseApi: IDatabaseApi;
  private logger: ILogger;
  private curGuild: IGuild;
  private curMessage: Message;
  private commands: Map<string, ICommand>;

  constructor(
    @inject(TYPES.DatabaseApi) databaseApi: IDatabaseApi,
    @inject(TYPES.CommandDeterminer) cmdDeterminer: ICommandDeterminer,
    @inject(TYPES.MessageFactory) msgFactory: () => MessageEmbed,//interfaces.Factory<Answer>,
    @inject(TYPES.Logger) logger: ILogger,
  ) {
    this.databaseApi = databaseApi;
    this.cmdDeterminer = cmdDeterminer;
    this.msgFactory = msgFactory;
    this.logger = logger;
    this.initCommands();
  }

  /**
   * @inheritDoc
   */
  public handle(msg: Message, curGuild: IGuild): void {
    this.curGuild = curGuild;
    this.curMessage = msg;

    this._handle();
  }

  /**
   * @inheritDoc
   */
  public addCommands(commands): void {
    commands.forEach((className: ICommandClass) => {
      this.addCommand(className);
    })
  }

  /**
   * @inheritDoc
   */
  public addCommand(className: ICommandClass): void {
    try {
      const commandName: string = lowerFirstChar(className.name);
      const command: ICommand = new className(this.msgFactory, this.databaseApi, this.logger);
      this.logger.log(Loglevel.DEBUG, 'add command: ' + commandName);
      this.commands.set(commandName, command);
    } catch (e) {
      this.logger.log(Loglevel.FATAL, 'couldn\'t init command: ' + e);
    }

  }

  /**
   * Init the commands-list
   */
  private initCommands(): void {
    this.commands = new Map<string, ICommand>();
  }

  /**
   * Handle the message
   */
  private _handle(): void {
    const [command, params] = this.cmdDeterminer.determine(
      this.commands,
      this.curMessage.content,
      this.curGuild.getConfig().getPrefix());

    if (command) {
      command.init(this.curGuild, this.curMessage);
      command.run(params);
    }
  }
}
