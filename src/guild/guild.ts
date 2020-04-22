import { Deck } from '../deck/deck';
import { GuildConfig } from './guild-config';
import { inject, injectable, interfaces } from 'inversify';
import { TYPES } from '../types';

@injectable()
export class Guild {
  private readonly deck: Deck;
  private readonly config: GuildConfig;

  public constructor(
    @inject(TYPES.GuildConfigFactory) guildConfigFactory: () => GuildConfig,//interfaces.Factory<GuildConfig>,
    @inject(TYPES.DeckFactory) deckFactory: () => Deck,//interfaces.Factory<Deck>,
  ) {
    this.config = guildConfigFactory();
    this.deck = deckFactory();
  }

  /**
   * Get the current deck
   *
   * @return Deck
   */
  public getDeck(): Deck {
    return this.deck;
  }

  /**
   * Get the guild config
   *
   * @return GuildConfig
   */
  public getConfig(): GuildConfig {
    return this.config;
  }
}
