import {
  Client,
  Message, Snowflake
} from "discord.js";
import {
  inject,
  injectable
} from "inversify";
import { TYPES } from './types';
import { Guild } from './guild/guild';

@injectable()
export class Bot {
  private client: Client;
  private config;
  private readonly token: string;
  private guilds: Map<Snowflake, Guild>;

  constructor(
    @inject(TYPES.Client) client: Client,
    @inject(TYPES.Token) token: string,
  ) {
    this.client = client;
    this.token = token;
    this.initGuilds();
  }

  public listen(): Promise<string> {
    this.client.on('message', (msg: Message) => {
      const guild = this.getGuild(msg.guild.id);
      guild.handleMessage(msg);
    })

    return this.client.login(
      this.token
    );
  }

  private getGuild(id: Snowflake): Guild {
    if (!this.guilds.has(id)) {
      this.guilds.set(id, new Guild(id));
    }

    return this.guilds.get(id);
  }

  private initGuilds() {
    this.guilds = new Map<Snowflake, Guild>();
  }
}
