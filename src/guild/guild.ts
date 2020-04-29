import { IDeck } from '../deck/deck';
import { IGuildConfig } from './guild-config';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { Snowflake } from 'discord.js';
import { IDatabaseApi } from '../database/database-api';
import { ReplaySubject } from 'rxjs';
import { ReplaySubjectFactory } from '../inversify.config';

export interface IGuild {

  /**
   * Initialize the guildConfig and load the config
   *
   * @param id: Snowflake
   *
   * @return ReplaySubject<void>
   */
  init(id: Snowflake): ReplaySubject<void>,

  /**
   * Get the guild-id
   *
   * @return Snowflake
   */
  getId(): Snowflake,

  /**
   * Get the current deck
   *
   * @return IDeck
   */
  getDeck(): IDeck,

  /**
   * Get the guildConfig config
   *
   * @return IGuildConfig
   */
  getConfig(): IGuildConfig,
}

@injectable()
export class Guild implements IGuild {
  private readonly databaseApi: IDatabaseApi
  private readonly deck: IDeck;
  private readonly replaySubjectFactory:  ReplaySubjectFactory;
  private config: IGuildConfig;
  private id: Snowflake;

  public constructor(
    @inject(TYPES.DeckFactory) deckFactory: () => IDeck,//interfaces.Factory<IDeck>,
    @inject(TYPES.DatabaseApi) databaseApi: IDatabaseApi,//interfaces.Factory<IGuildConfig>,
    @inject(TYPES.ReplaySubjectFactory) replaySubjectFactory:  ReplaySubjectFactory
  ) {
    this.replaySubjectFactory = replaySubjectFactory;
    this.databaseApi = databaseApi;
    this.deck = deckFactory();
  }

  /**
   * @inheritDoc
   */
  public getId(): Snowflake {
    return this.id;
  }

  /**
   * @inheritDoc
   */
  public getDeck(): IDeck {
    return this.deck;
  }

  /**
   * @inheritDoc
   */
  public getConfig(): IGuildConfig {
    return this.config;
  }

  /**
   * @inheritDoc
   */
  public init(id: Snowflake): ReplaySubject<void> {
    const ret: ReplaySubject<void> = this.replaySubjectFactory<void>();
    this.id = id;
    this.databaseApi.loadGuildConfig(id)
      .subscribe(
        (config: IGuildConfig) => {
          this.config = config;
          this.deck.shuffle(this.config.getDeckType(), this.config.getJoker());
          ret.next();
        },
        (e) => ret.error(e));
    return ret;
  }
}
