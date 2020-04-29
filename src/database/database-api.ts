import { Snowflake } from 'discord.js';
import { IGuildConfig } from '../guild/guild-config';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger, Loglevel } from '../logger/logger-interface';
import { Observable, ReplaySubject } from 'rxjs';
import { ReplaySubjectFactory } from '../inversify.config';

export interface IDatabaseApi {
  /**
   * Load the config of a guildConfig with the guildConfig-id
   *
   * @param guildId: Snowflake
   */
  loadGuildConfig(guildId: Snowflake): ReplaySubject<IGuildConfig>,

  /**
   * Save the config of a guildConfig
   *
   * @param guildId: Snowflake
   * @param guildConfig: IGuildConfig
   */
  saveGuildConfig(guildId: Snowflake, guildConfig: IGuildConfig): Observable<void>
}

@injectable()
export abstract class AbstractDatabaseApi implements IDatabaseApi {
  protected readonly guildConfigFactory: () => IGuildConfig;
  protected readonly replaySubjectFactory:  ReplaySubjectFactory;
  protected guildConfig: IGuildConfig;
  protected logger: ILogger;

  public constructor(
    @inject(TYPES.GuildConfigFactory) guildConfigFactory: () => IGuildConfig, //interfaces.Factory<IGuild>
    @inject(TYPES.Logger) logger: ILogger,
    @inject(TYPES.ReplaySubjectFactory) replaySubjectFactory:  ReplaySubjectFactory
  ) {
    this.replaySubjectFactory = replaySubjectFactory;
    this.guildConfigFactory = guildConfigFactory;
    this.logger = logger;
    this.logger.log(Loglevel.DEBUG, 'Constructed Database-Api');
  }

  /**
   * @inheritDoc
   */
  public abstract loadGuildConfig(guildId: Snowflake): ReplaySubject<IGuildConfig>;

  /**
   * @inheritDoc
   */
  public abstract saveGuildConfig(guildId: Snowflake, guildConfig: IGuildConfig): Observable<void>;
}
