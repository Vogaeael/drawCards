import "reflect-metadata";
import { Container, interfaces } from "inversify";
import { TYPES } from "./types";
import { IBot, Bot } from "./bot";
import { Client, MessageEmbed } from "discord.js";
import { CommandDeterminer } from './command-handler/command-determiner';
import { IGuild, Guild } from './guild/guild';
import { IGuildConfig, GuildConfig } from './guild/guild-config';
import { IDeck, Deck } from './deck/deck';
import { ICard, Card } from './deck/card';
import { CommandHandler } from './command-handler/command-handler';
import { ICommand } from './command-handler/commands/command';
import { IDatabaseApi } from './database/database-api';
import { XmlApi } from './database/xml-api/xml-api';
import { ILogger } from './logger/logger-interface';
import { ConsoleLogger } from './logger/console-log/console-logger';
import { FileLogger } from './logger/file-log/file-logger';

let container = new Container();

container.bind<string>(TYPES.LogLevel)
  .toConstantValue(process.env.LOGLEVEL);
container.bind<ILogger>(TYPES.Logger)
  .to(FileLogger).inSingletonScope();

container.bind<IBot>(TYPES.Bot)
  .to(Bot).inSingletonScope();
container.bind<Client>(TYPES.Client)
  .toConstantValue(new Client());
container.bind<string>(TYPES.Token)
  .toConstantValue(process.env.TOKEN);

container.bind<CommandDeterminer>(TYPES.CommandDeterminer)
  .toConstantValue(new CommandDeterminer(container.get<ILogger>(TYPES.Logger)));
container.bind<CommandHandler>(TYPES.CommandHandler)
  .to(CommandHandler).inSingletonScope();

container.bind<IDatabaseApi>(TYPES.DatabaseApi)
  .to(XmlApi);
container.bind<IGuild>(TYPES.Guild)
  .to(Guild);
container.bind<interfaces.Factory<IGuild>>(TYPES.GuildFactory)
  .toAutoFactory<IGuild>(TYPES.Guild);

container.bind<IGuildConfig>(TYPES.GuildConfig)
  .to(GuildConfig);
container.bind<interfaces.Factory<IGuildConfig>>(TYPES.GuildConfigFactory)
  .toAutoFactory<IGuildConfig>(TYPES.GuildConfig);

container.bind<IDeck>(TYPES.Deck)
  .to(Deck);
container.bind<interfaces.Factory<IDeck>>(TYPES.DeckFactory)
  .toAutoFactory<IDeck>(TYPES.Deck);

container.bind<ICard>(TYPES.Card)
  .to(Card);
container.bind<interfaces.Factory<ICard>>(TYPES.CardFactory)
  .toAutoFactory<ICard>(TYPES.Card);

container.bind<MessageEmbed>(TYPES.Message)
  .to(MessageEmbed);
container.bind<interfaces.Factory<MessageEmbed>>(TYPES.MessageFactory)
  .toFactory(() =>
    () => new MessageEmbed()
  );

export default container;
