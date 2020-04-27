import { IGuild } from '../../guild/guild';
import { Message, MessageEmbed } from 'discord.js';
import { AnswerColor } from '../answer-color';
import { inject } from 'inversify';
import { TYPES } from '../../types';
import { IDatabaseApi } from '../../database/database-api';
import { ILogger, Loglevel } from '../../logger/logger-interface';
import { ICommandHandler } from '../command-handler';

export type MessageFactory = () => MessageEmbed;

export interface ICommandClass {
  new (msgFactory: MessageFactory,
       databaseApi: IDatabaseApi,
       logger: ILogger,
       cmdHandler: ICommandHandler): ICommand;
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

  /**
   * Print the command help
   */
  help(): void
}

export abstract class Command implements ICommand {
  private static readonly black_check_mark = '✔';
  private static readonly white_check_mark = '✅';
  private static readonly box_check_mark = '☑';
  private readonly databaseApi: IDatabaseApi;
  private readonly msgFactory: MessageFactory;
  protected readonly cmdHandler: ICommandHandler;
  protected curGuild: IGuild;
  protected msg: Message;
  protected answer: MessageEmbed;
  protected logger: ILogger;

  constructor(
    @inject(TYPES.MessageFactory) msgFactory: MessageFactory,
    @inject(TYPES.DatabaseApi) databaseApi: IDatabaseApi,
    @inject(TYPES.Logger) logger: ILogger,
    @inject(TYPES.CommandHandler) cmdHandler: ICommandHandler
  ) {
    this.msgFactory = msgFactory;
    this.databaseApi = databaseApi;
    this.logger = logger;
    this.cmdHandler = cmdHandler;
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
   * @inheritDoc
   */
  public abstract help(): void;

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
   * @param title: string the title of the message
   * @param description: string the description of the message
   * @param force: boolean default: false, if the maximized version should be forced.
   */
  protected replyConfigChange(title: string, description: string, force: boolean = false): void {
    if (!force && this.curGuild.getConfig().getMinimized()) {
      this.msg.react(Command.white_check_mark)
        .catch(
          (e) => {
            this.logger.log(
              Loglevel.FATAL,
              'couldn\'t add reaction in channel \'' +
              this.msg.channel +
              '\' in guild \'' +
              this.msg.guild +
              '\': ' +
              e);
          });

      return
    }
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

  /**
   * Send a short help for the command
   *
   * @param name: string
   * @param description: string
   */
  protected sendShortHelp(name: string, description: string): void {
    this.answer.setAuthor(
      name,
      'https://cdn.discordapp.com/avatars/701496633489096815/66f7d3f5e9a01a73022c71bd94d41811.png',
      'https://github.com/Vogaeael/drawCards')
      .setDescription(description)
      .setTitle(name)
      .setColor(AnswerColor.info)
      .attachFiles(['./media/images/deck_icons.png'])
      .setThumbnail('attachment://deck_icons.png');
    this.sendAnswer();
  }
}
