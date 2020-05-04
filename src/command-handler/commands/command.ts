import { IGuild } from '../../guild/guild';
import { Message, MessageEmbed } from 'discord.js';
import { AnswerColor } from '../answer-color';
import { inject } from 'inversify';
import { TYPES } from '../../types';
import { IDatabaseApi } from '../../database/database-api';
import { ILogger, Loglevel } from '../../logger/logger-interface';
import { ICommandList } from '../command-list';
import { CardFile, IDesignHandler } from '../../design/designHandler';
import { ICard } from '../../deck/card';
import { from, ReplaySubject } from 'rxjs';
import { MapFactory, ReplaySubjectFactory } from '../../inversify.config';

export type MessageFactory = () => MessageEmbed;

export type CommandFactory = (name: ICommandClass, cmdHandler: ICommandList) => ICommand;

export interface ICommandClass {
  new(msgFactory: MessageFactory,
      databaseApi: IDatabaseApi,
      logger: ILogger,
      cmdHandler: ICommandList,
      designHandler: IDesignHandler,
      mapFactory: MapFactory,
      replaySubjectFactory: ReplaySubjectFactory
  ): ICommand;
}

export interface ICommand {
  /**
   * Run the command with the params
   *
   * @param commandName: string
   * @param params: string
   */
  run(commandName: string, params: string): void,

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
  help(): void,

  /**
   * The name of the command
   */
  name: string[]
}

export abstract class Command implements ICommand {
  private static readonly black_check_mark = '✔';
  private static readonly white_check_mark = '✅';
  private static readonly box_check_mark = '☑';
  private readonly databaseApi: IDatabaseApi;
  private readonly msgFactory: MessageFactory;
  private readonly replaySubjectFactory: ReplaySubjectFactory;
  protected readonly cmdList: ICommandList;
  protected readonly designHandler: IDesignHandler;
  protected readonly mapFactory: MapFactory;
  protected curGuild: IGuild;
  protected msg: Message;
  protected answer: MessageEmbed;
  protected logger: ILogger;
  /**
   * @inheritDoc
   */
  public abstract name: string[];

  constructor(
    @inject(TYPES.MessageFactory) msgFactory: MessageFactory,
    @inject(TYPES.DatabaseApi) databaseApi: IDatabaseApi,
    @inject(TYPES.Logger) logger: ILogger,
    @inject(TYPES.CommandList) cmdList: ICommandList,
    @inject(TYPES.DesignHandler) designHandler: IDesignHandler,
    @inject(TYPES.MapFactory) mapFactory: MapFactory,
    @inject(TYPES.ReplaySubjectFactory) replaySubjectFactory: ReplaySubjectFactory
  ) {
    this.msgFactory = msgFactory;
    this.databaseApi = databaseApi;
    this.logger = logger;
    this.cmdList = cmdList;
    this.designHandler = designHandler;
    this.mapFactory = mapFactory;
    this.replaySubjectFactory = replaySubjectFactory;
  }

  /**
   * @inheritDoc
   */
  public abstract run(commandName: string, params: string): void;

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
  protected sendAnswer(
    then: (message: Message) => void = () => {},
    error: (e) => void = (e) => this.logger.log(Loglevel.ERROR, 'Couldn\'t send answer: ' + e)
  ): void {
    this.logger.log(Loglevel.DEBUG, 'send answer');
    from(this.msg.channel.send(this.answer)).subscribe(then, error);
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
   * @param commandName: string
   * @param param: string
   */
  protected logCommand(
    command: string,
    commandName: string,
    param: string
  ): void {
    let logMessage = 'Run Command-class \'' + command + '\' with command \'' + commandName + '\' from guild \'' + this.curGuild.getId() + '\'';
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

  /**
   * Add an image for the card
   *
   * @param card: Card
   *
   * @return ReplaySubject<void>
   */
  protected addCardImage(card: ICard): ReplaySubject<void> {
    const subject: ReplaySubject<void> = this.replaySubjectFactory<void>();
    this.designHandler.getCardPath(this.curGuild.getConfig().getDesign(), card)
      .subscribe(
        (cardFile: CardFile) => {
          this.answer.attachFiles([cardFile.path + cardFile.file]);
          this.answer.setImage('attachment://' + cardFile.file);
          subject.next();
          subject.complete();
        },
        (e) => {
          this.logger.log(Loglevel.FATAL, 'Card image not found: ' + e);
          subject.error('Card image not found.');
        }
      );
    return subject;
  }
}
