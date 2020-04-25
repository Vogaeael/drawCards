import { IGuild } from '../../guild/guild';
import { Message, MessageEmbed } from 'discord.js';
import { AnswerColor } from '../answer-color';
import { inject } from 'inversify';
import { TYPES } from '../../types';
import { IDatabaseApi } from '../../database/database-api';

export type MessageFactory = () => MessageEmbed;

export interface ICommandClass {
  new (msgFactory: MessageFactory, databaseApi: IDatabaseApi): ICommand;
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

  constructor(
    @inject(TYPES.MessageFactory) msgFactory: MessageFactory,
    @inject(TYPES.DatabaseApi) databaseApi: IDatabaseApi,
  ) {
    this.msgFactory = msgFactory;
    this.databaseApi = databaseApi;
  }

  /**
   * @inheritDoc
   */
  public abstract run(params: string): void;

  /**
   * @inheritDoc
   */
  public init(guild: IGuild, msg: Message): void {
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
}
