import "reflect-metadata";
import { Container, interfaces } from "inversify";
import { TYPES } from "./types";
import { Bot } from "./bot";
import { Client, MessageEmbed } from "discord.js";
import { CommandDeterminer } from './command-handler/command-determiner';
import { Guild } from './guild/guild';
import { GuildConfig } from './guild/guild-config';
import { Deck } from './deck/deck';
import { Card } from './deck/card';
import { CommandHandler } from './command-handler/command-handler';

let container = new Container();

container.bind<Bot>(TYPES.Bot)
  .to(Bot).inSingletonScope();
container.bind<Client>(TYPES.Client)
  .toConstantValue(new Client());
container.bind<string>(TYPES.Token)
  .toConstantValue(process.env.TOKEN);

container.bind<CommandDeterminer>(TYPES.CommandDeterminer)
  .toConstantValue(new CommandDeterminer());
container.bind<CommandHandler>(TYPES.CommandHandler)
  .to(CommandHandler).inSingletonScope();

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

container.bind<MessageEmbed>(TYPES.Message)
  .to(MessageEmbed);
container.bind<interfaces.Factory<MessageEmbed>>(TYPES.MessageFactory)
  .toFactory(() =>
    () => new MessageEmbed()
  );

export default container;
