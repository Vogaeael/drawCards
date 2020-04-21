import {
  Client,
  Message, Snowflake
} from "discord.js";
import {
  inject,
  injectable, interfaces
} from "inversify";
import { TYPES } from './types';
import { Guild } from './guild/guild';
import { CommandHandler } from './command-handler';

@injectable()
export class Bot {
  private client: Client;
  private config;
  private readonly token: string;
  private readonly guildFactory: () => Guild; //interfaces.Factory<Guild>;
  private guilds: Map<Snowflake, Guild>;
  private readonly cmdHandler: CommandHandler;

  constructor(
    @inject(TYPES.Client) client: Client,
    @inject(TYPES.Token) token: string,
    @inject(TYPES.CommandHandler) cmdHandler: CommandHandler,
    @inject(TYPES.GuildFactory) guildFactory: () => Guild//interfaces.Factory<Guild>
  ) {
    this.guildFactory = guildFactory;
    this.client = client;
    this.token = token;
    this.cmdHandler = cmdHandler;
    this.initGuilds();
  }

  public listen(): Promise<string> {
    this.client.on('message', (msg: Message) => {
      if (msg.author.bot) {
        return;
      }
      const guild = this.getGuild(msg.guild.id);
      guild.handleMessage(msg);
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
  private getGuild(id: Snowflake): Guild {
    if (!this.guilds.has(id)) {
      this.guilds.set(id, this.guildFactory());
    }

    return this.guilds.get(id);
  }

  private initGuilds(): void {
    this.guilds = new Map<Snowflake, Guild>();
  }
}
