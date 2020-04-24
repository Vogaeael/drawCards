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
import { Help } from './command-handler/commands/help';
import { Shuffle } from './command-handler/commands/shuffle';
import { Draw } from './command-handler/commands/draw';
import { UseStandardDeck } from './command-handler/commands/use-standard-deck';
import { UseStrippedDeck } from './command-handler/commands/use-stripped-deck';
import { UseJoker } from './command-handler/commands/use-joker';
import { DontUseJoker } from './command-handler/commands/dont-use-joker';
import { PrintMinimized } from './command-handler/commands/print-minimized';
import { PrintMaximized } from './command-handler/commands/print-maximized';
import { SetPrefix } from './command-handler/commands/set-prefix';
import { ICommand } from './command-handler/commands/command';

let container = new Container();

container.bind<IBot>(TYPES.Bot)
  .to(Bot).inSingletonScope();
container.bind<Client>(TYPES.Client)
  .toConstantValue(new Client());
container.bind<string>(TYPES.Token)
  .toConstantValue(process.env.TOKEN);

container.bind<ICommand>(TYPES.Shuffle)
  .to(Shuffle).inSingletonScope();
container.bind<ICommand>(TYPES.Draw)
  .to(Draw).inSingletonScope();
container.bind<ICommand>(TYPES.UseStandardDeck)
  .to(UseStandardDeck).inSingletonScope();
container.bind<ICommand>(TYPES.UseStrippedDeck)
  .to(UseStrippedDeck).inSingletonScope();
container.bind<ICommand>(TYPES.UseJoker)
  .to(UseJoker).inSingletonScope();
container.bind<ICommand>(TYPES.DontUseJoker)
  .to(DontUseJoker).inSingletonScope();
container.bind<ICommand>(TYPES.PrintMinimized)
  .to(PrintMinimized).inSingletonScope();
container.bind<ICommand>(TYPES.PrintMaximized)
  .to(PrintMaximized).inSingletonScope();
container.bind<ICommand>(TYPES.SetPrefix)
  .to(SetPrefix).inSingletonScope();
container.bind<ICommand>(TYPES.Help)
  .to(Help).inSingletonScope();

container.bind<CommandDeterminer>(TYPES.CommandDeterminer)
  .toConstantValue(new CommandDeterminer());
container.bind<CommandHandler>(TYPES.CommandHandler)
  .to(CommandHandler).inSingletonScope();

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
