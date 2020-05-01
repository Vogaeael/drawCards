import { IDeck } from '../deck/deck';
import { IGuildConfig } from './guild-config';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { Snowflake } from 'discord.js';
import { IDatabaseApi } from '../database/database-api';
import { Subject } from 'rxjs';

export interface IGuild {

  /**
   * Initialize the guildConfig and load the config
   *
   * @param id: Snowflake
   *
   * @return Subject<void>
   */
  init(id: Snowflake): Subject<void>,

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
  private config: IGuildConfig;
  private id: Snowflake;

  public constructor(
    @inject(TYPES.DeckFactory) deckFactory: () => IDeck,//interfaces.Factory<IDeck>,
    @inject(TYPES.DatabaseApi) databaseApi: IDatabaseApi,//interfaces.Factory<IGuildConfig>,
  ) {
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
  public init(id: Snowflake): Subject<void> {
    const ret: Subject<void> = new Subject<void>();
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
