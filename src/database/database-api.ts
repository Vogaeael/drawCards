import { Snowflake } from 'discord.js';
import { IGuildConfig } from '../guild/guild-config';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger-interface';

export interface IDatabaseApi {
  /**
   * Load the config of a guildConfig with the guildConfig-id
   *
   * @param guildId: Snowflake
   */
  loadGuildConfig(guildId: Snowflake): Promise<IGuildConfig>,

  /**
   * Save the config of a guildConfig
   *
   * @param guildId: Snowflake
   * @param guildConfig: IGuildConfig
   */
  saveGuildConfig(guildId: Snowflake, guildConfig: IGuildConfig): boolean
}

@injectable()
export abstract class AbstractDatabaseApi implements IDatabaseApi {
  private readonly guildConfigFactory: () => IGuildConfig;
  protected guildConfig: IGuildConfig;
  protected logger: ILogger;

  public constructor(
    @inject(TYPES.GuildConfigFactory) guildConfigFactory: () => IGuildConfig, //interfaces.Factory<IGuild>
    @inject(TYPES.Logger) logger: ILogger
  ) {
    this.guildConfigFactory = guildConfigFactory;
    this.logger = logger;
  }

  /**
   * @inheritDoc
   */
  public abstract loadGuildConfig(guildId: Snowflake): Promise<IGuildConfig>;

  /**
   * @inheritDoc
   */
  public abstract saveGuildConfig(guildId: Snowflake, guildConfig: IGuildConfig): boolean;

  /**
   * Initialize the guild-config
   */
  protected initGuildConfig(): void {
    this.guildConfig = this.guildConfigFactory();
  }
}
