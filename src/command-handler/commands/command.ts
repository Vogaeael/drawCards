import { IGuild } from '../../guild/guild';
import { Message, MessageEmbed } from 'discord.js';
import { AnswerColor } from '../answer-color';
import { inject } from 'inversify';
import { TYPES } from '../../types';
import { IDatabaseApi } from '../../database/database-api';
import { ILogger, Loglevel } from '../../logger/logger-interface';

export type MessageFactory = () => MessageEmbed;

export interface ICommandClass {
  new (msgFactory: MessageFactory,
       databaseApi: IDatabaseApi,
       logger: ILogger): ICommand;
}

export interface ICommand {
  /**
   * Run the command with the params
   *
   * @param params: string
   */
  run(params: string): void,

  /**
   * Initialize the command and set the values
   *
   * @param guild: IGuild
   * @param msg: Message
   */
  init(guild: IGuild, msg: Message): void,
}

export abstract class Command implements ICommand {
  private readonly databaseApi: IDatabaseApi;
  private readonly msgFactory: MessageFactory;
  protected curGuild: IGuild;
  protected msg: Message;
  protected answer: MessageEmbed;
  protected logger: ILogger;

  constructor(
    @inject(TYPES.MessageFactory) msgFactory: MessageFactory,
    @inject(TYPES.DatabaseApi) databaseApi: IDatabaseApi,
    @inject(TYPES.Logger) logger: ILogger
  ) {
    this.msgFactory = msgFactory;
    this.databaseApi = databaseApi;
    this.logger = logger;
  }

  /**
   * @inheritDoc
   */
  public abstract run(params: string): void;

  /**
   * @inheritDoc
   */
  public init(guild: IGuild, msg: Message): void {
    this.logger.log(Loglevel.DEBUG, 'init command');
    this.curGuild = guild;
    this.msg = msg;
    this.initAnswer();
  }

  /**
   * Initialize the answer
   */
  protected initAnswer(): void {
    this.answer = this.msgFactory();
  }

  /**
   * Send the current answer
   */
  protected sendAnswer(): void {
    this.logger.log(Loglevel.DEBUG, 'send answer');
    this.msg.channel.send(this.answer);
  }

  /**
   * Reply to the change of the config
   *
   * @param title: string
   * @param description: string
   */
  protected replyConfigChange(title: string, description: string): void {
    this.answer.setTitle(title)
      .setDescription(this.getMentionOfAuthor() + ' ' + description)
      .setColor(AnswerColor.config_reply);
    this.sendAnswer();
  }

  /**
   * Get the mention of the author
   * For example <@12345678901234567>
   */
  protected getMentionOfAuthor(): string {
    return '<@' + this.msg.author.id + '>';
  }

  /**
   * Save the current guild config
   */
  protected saveGuildConfig(): void {
    this.databaseApi.saveGuildConfig(this.curGuild.getId(), this.curGuild.getConfig());
  }

  /**
   * Log command with debug level
   *
   * @param command: string
   * @param param: string
   */
  protected logCommand(command: string, param: string = ''): void {
    let logMessage = 'Command \'' + command + '\' from guild \'' + this.curGuild.getId() + '\'';
    if ('' !== param) {
      logMessage += ' with param \'' + param + '\'';
    }
    this.logger.log(Loglevel.DEBUG, logMessage);
  }
}
