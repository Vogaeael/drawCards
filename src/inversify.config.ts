import "reflect-metadata";
import { Container, interfaces } from "inversify";
import { TYPES } from "./types";
import { Bot } from "./bot";
import { Client } from "discord.js";
import { CommandHandler } from './command-handler';
import { Guild } from './guild/guild';
import { GuildConfig } from './guild/guild-config';
import { Deck } from './deck/deck';
import { Card } from './deck/card';

let container = new Container();

container.bind<Bot>(TYPES.Bot)
  .to(Bot).inSingletonScope();
container.bind<Client>(TYPES.Client)
  .toConstantValue(new Client());
container.bind<string>(TYPES.Token)
  .toConstantValue(process.env.TOKEN);
container.bind<CommandHandler>(TYPES.CommandHandler)
  .toConstantValue(new CommandHandler());

container.bind<Guild>(TYPES.Guild)
  .to(Guild);
container.bind<interfaces.Factory<Guild>>(TYPES.GuildFactory)
  .toAutoFactory<Guild>(TYPES.Guild);

container.bind<GuildConfig>(TYPES.GuildConfig)
  .to(GuildConfig);
container.bind<interfaces.Factory<GuildConfig>>(TYPES.GuildConfigFactory)
  .toAutoFactory<GuildConfig>(TYPES.GuildConfig);

container.bind<Deck>(TYPES.Deck)
  .to(Deck);
container.bind<interfaces.Factory<Deck>>(TYPES.DeckFactory)
  .toAutoFactory<Deck>(TYPES.Deck);

container.bind<Card>(TYPES.Card)
  .to(Card);
container.bind<interfaces.Factory<Card>>(TYPES.CardFactory)
  .toAutoFactory<Card>(TYPES.Card);

export default container;
