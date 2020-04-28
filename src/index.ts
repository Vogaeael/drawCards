require('dotenv').config(); // Recommended way of loading dotenv
import container from "./inversify.config";
import { TYPES } from "./types";
import { Bot } from "./bot";
import { DontUseJoker } from './command-handler/commands/dont-use-joker';
import { Draw } from './command-handler/commands/draw';
import { Help } from './command-handler/commands/help';
import { PrintMaximized } from './command-handler/commands/print-maximized';
import { PrintMinimized } from './command-handler/commands/print-minimized';
import { SetPrefix } from './command-handler/commands/set-prefix';
import { Shuffle } from './command-handler/commands/shuffle';
import { UseJoker } from './command-handler/commands/use-joker';
import { UseStandardDeck } from './command-handler/commands/use-standard-deck';
import { UseStrippedDeck } from './command-handler/commands/use-stripped-deck';
import { CommandHandler } from './command-handler/command-handler';
import { CardsLeft } from './command-handler/commands/cards-left';
import { ILogger, Loglevel } from './logger/logger-interface';
import { Konami } from './command-handler/commands/konami';

const bot = container.get<Bot>(TYPES.Bot);
const logger = container.get<ILogger>(TYPES.Logger);
const commandHandler = container.get<CommandHandler>(TYPES.CommandHandler);

bot.listen().then(() => {
  logger.log(Loglevel.DEBUG, 'Logged in!');
}).catch((error) => {
  logger.log(Loglevel.ERROR, 'Oh no! ' + error);
});

commandHandler.addCommands([
  CardsLeft,
  DontUseJoker,
  Draw,
  Help,
  Konami,
  PrintMaximized,
  PrintMinimized,
  SetPrefix,
  Shuffle,
  UseJoker,
  UseStandardDeck,
  UseStrippedDeck
]);
