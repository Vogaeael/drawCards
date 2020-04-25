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

let bot = container.get<Bot>(TYPES.Bot);

bot.listen().then(() => {
  console.log('Logged in!')
}).catch((error) => {
  console.log('Oh no! ', error)
});

const commandHandler = container.get<CommandHandler>(TYPES.CommandHandler);
commandHandler.addCommands([
  CardsLeft,
  DontUseJoker,
  Draw,
  Help,
  PrintMaximized,
  PrintMinimized,
  SetPrefix,
  Shuffle,
  UseJoker,
  UseStandardDeck,
  UseStrippedDeck
]);
