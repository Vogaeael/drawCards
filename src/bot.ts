import { Client, Message, Snowflake } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from './types';
import { IGuild } from './guild/guild';
import { ILogger, Loglevel } from './logger/logger-interface';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface MessageToHandle {
  msg: Message,
  guild: IGuild
}

export interface IBot {
  /**
   * Listen to messages
   *
   * @return Promise<string>
   */
  listen(): Promise<string>,

  /**
   * Listen to the next message to handle
   *
   * @param next: (value: MessageToHandle) => void
   * @param error: (e) => void
   */
  listenMessageToHandle(next: (value: MessageToHandle) => void, error: (e) => void): void,
}

@injectable()
export class Bot implements IBot {
  private client: Client;
  private readonly token: string;
  private readonly guildFactory: () => IGuild; //interfaces.Factory<IGuild>;
  private guilds: Map<Snowflake, IGuild>;
  private logger: ILogger;
  private lastMessage: Subject<Message> = new Subject<Message>();
  private msgToHandle: Subject<MessageToHandle> = new Subject<MessageToHandle>();

  constructor(
    @inject(TYPES.Client) client: Client,
    @inject(TYPES.Token) token: string,
    @inject(TYPES.GuildFactory) guildFactory: () => IGuild,//interfaces.Factory<IGuild>,
    @inject(TYPES.Logger) logger: ILogger
  ) {
    this.guildFactory = guildFactory;
    this.client = client;
    this.token = token;
    this.logger = logger;
    this.initGuilds();
    this.logger.log(Loglevel.DEBUG, 'Constructed bot');
  }

  /**
   * @inheritDoc
   */
  public listen(): Promise<string> {
    this.listenMessage();
    this.client.on('message', async(msg: Message) => {
      this.lastMessage.next(msg);
    })

    return this.client.login(
      this.token
    );
  }

  /**
   * @inheritDoc
   */
  public listenMessageToHandle(next: (value: MessageToHandle) => void, error: (e) => void): void {
    this.msgToHandle.subscribe(next, error);
  }

  /**
   * Listen to lastMessage to handle it.
   */
  private listenMessage(): void {
    this.lastMessage.pipe(
      filter((msg: Message) => !msg.author.bot),
      filter((msg: Message) => !!msg.guild))
      .subscribe(
        (msg: Message) => {
          this.getGuild(msg.guild.id).subscribe(
            (guild: IGuild) => {
              this.logger.log(Loglevel.DEBUG, 'Set message to handle');
              this.msgToHandle.next({
                msg: msg,
                guild: guild
              });
            },
            (e) => this.logger.log(Loglevel.FATAL, 'Error with getting guild: ' + e))
        },
        (e) => this.logger.log(Loglevel.FATAL, 'Error with incoming message: ' + e));
  }

  /**
   * Get the guild with the id, or create a new one
   *
   * @param id
   */
  private getGuild(id: Snowflake): Subject<IGuild> {
    const guild = new Subject<IGuild>();

    if (!this.guilds.has(id)) {
      this.logger.log(Loglevel.DEBUG, 'guild \'' + id + '\' not loaded from database yet');
      const newGuild: IGuild = this.guildFactory();
      newGuild.init(id).subscribe(
        () => {
          this.guilds.set(id, newGuild);
          guild.next(this.guilds.get(id));
        },
        (e) =>
          this.logger.log(Loglevel.FATAL, 'Error with initializing guild: ' + e)
      );
    } else {
      guild.next(this.guilds.get(id));
    }

    return guild;
  }

  /**
   * Initialize the guild-map
   */
  private initGuilds(): void {
    this.guilds = new Map<Snowflake, IGuild>();
  }
}
