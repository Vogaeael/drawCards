import { IDeck } from '../deck/deck';
import { IGuildConfig } from './guild-config';
import { inject, injectable, interfaces } from 'inversify';
import { TYPES } from '../types';

export interface IGuild {
  /**
   * Get the current deck
   *
   * @return IDeck
   */
  getDeck(): IDeck,

  /**
   * Get the guild config
   *
   * @return IGuildConfig
   */
  getConfig(): IGuildConfig,
}

@injectable()
export class Guild implements IGuild {
  private readonly deck: IDeck;
  private readonly config: IGuildConfig;

  public constructor(
    @inject(TYPES.GuildConfigFactory) guildConfigFactory: () => IGuildConfig,//interfaces.Factory<IGuildConfig>,
    @inject(TYPES.DeckFactory) deckFactory: () => IDeck,//interfaces.Factory<IDeck>,
  ) {
    this.config = guildConfigFactory();
    this.deck = deckFactory();
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
}
