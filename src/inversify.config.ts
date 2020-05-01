import "reflect-metadata";
import { Container, interfaces } from "inversify";
import { TYPES } from "./types";
import { Bot, IBot } from "./bot";
import { Client, MessageEmbed } from "discord.js";
import { CommandDeterminer, ICommandDeterminer } from './command-handler/command-determiner';
import { Guild, IGuild } from './guild/guild';
import { GuildConfig, IGuildConfig } from './guild/guild-config';
import { Deck, IDeck } from './deck/deck';
import { Card, ICard } from './deck/card';
import { CommandHandler, ICommandHandler } from './command-handler/command-handler';
import { IDatabaseApi } from './database/database-api';
import { XmlApi } from './database/xml-api/xml-api';
import { ILogger, Loglevel } from './logger/logger-interface';
import { FileLogger } from './logger/file-log/file-logger';
import { CommandFactory, ICommand, ICommandClass, MessageFactory } from './command-handler/commands/command';
import { CommandList, ICommandList } from './command-handler/command-list';

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

container.bind<ICommandList>(TYPES.CommandList)
  .to(CommandList).inSingletonScope();

// container.bind<CommandDeterminer>(TYPES.CommandDeterminer)
//   .toConstantValue(new CommandDeterminer(container.get<ILogger>(TYPES.Logger)));
container.bind<ICommandDeterminer>(TYPES.CommandDeterminer)
  .to(CommandDeterminer).inSingletonScope();
container.bind<CommandHandler>(TYPES.CommandHandler)
  .to(CommandHandler).inSingletonScope();

container.bind<(context: interfaces.Context) => CommandFactory>(TYPES.CommandFactory)
  .toFactory((context: interfaces.Context) => {
    const msgFactory: MessageFactory = context.container.get<MessageFactory>(TYPES.MessageFactory);
    const databaseApi: IDatabaseApi = context.container.get<IDatabaseApi>(TYPES.DatabaseApi);
    const logger: ILogger = context.container.get<ILogger>(TYPES.Logger);
    return (name: ICommandClass, cmdList: ICommandList) => {
      try {
        return new name(
          msgFactory,
          databaseApi,
          logger,
          cmdList
        );
      } catch (e) {
        logger.log(Loglevel.FATAL, 'couldn\'t init command: ' + name.toString() + ': ' + e);
        return undefined;
      }
    };
  });

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
