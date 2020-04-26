import { Client, Guild, Message, Snowflake } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from './types';
import { IGuild } from './guild/guild';
import { ICommandHandler } from './command-handler/command-handler';
import { ILogger, Loglevel } from './logger/logger-interface';

export interface IBot {
  /**
   * Listen to messages
   *
   * @return Promise<string>
   */
  listen(): Promise<string>
}

@injectable()
export class Bot implements IBot {
  private client: Client;
  private readonly token: string;
  private readonly guildFactory: () => IGuild; //interfaces.Factory<IGuild>;
  private cmdHandler: ICommandHandler;
  private guilds: Map<Snowflake, IGuild>;
  private logger: ILogger;

  constructor(
    @inject(TYPES.Client) client: Client,
    @inject(TYPES.Token) token: string,
    @inject(TYPES.GuildFactory) guildFactory: () => IGuild,//interfaces.Factory<IGuild>,
    @inject(TYPES.CommandHandler) cmdHandler: ICommandHandler,
    @inject(TYPES.Logger) logger: ILogger
  ) {
    this.cmdHandler = cmdHandler;
    this.guildFactory = guildFactory;
    this.client = client;
    this.token = token;
    this.logger = logger;
    this.initGuilds();
  }

  /**
   * @inheritDoc
   */
  public listen(): Promise<string> {
    this.client.on('message', async (msg: Message) => {
      if (msg.author.bot) {
        return;
      }

      const dGuild: Guild = msg.guild;
      if (dGuild) {
        const guild: IGuild = await this.getGuild(dGuild.id);

        this.cmdHandler.handle(msg, guild);
      }
    })

    return this.client.login(
      this.token
    );
  }

  /**
   * Get the guild with the id, or create a new one
   *
   * @param id
   */
  private async getGuild(id: Snowflake): Promise<IGuild> {
    if (!this.guilds.has(id)) {
      this.logger.log(Loglevel.DEBUG, 'guild \'' + id + '\' not loaded from database yet');
      const newGuild: IGuild = this.guildFactory();
      await newGuild.init(id);
      this.guilds.set(id, newGuild);
    }

    return this.guilds.get(id);
  }

  /**
   * Initialize the guild-map
   */
  private initGuilds(): void {
    this.guilds = new Map<Snowflake, IGuild>();
  }
}
