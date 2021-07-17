require('dotenv').config(); // Recommended way of loading dotenv
import container from "./inversify.config";
import { TYPES } from "./types";
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
import { CardsLeft } from './command-handler/commands/cards-left';
import { Konami } from './command-handler/commands/konami';
import { ICommandList } from './command-handler/command-list';
import { SetDesign } from './command-handler/commands/set-design';
import { ListDesigns } from './command-handler/commands/list-designs';
import { ICommandHandler } from './command-handler/command-handler';

const commandList: ICommandList = container.get<ICommandList>(TYPES.CommandList);
// To construct the handler, if not, it will never be initialized and the command-determiner also.
const commandHandler: ICommandHandler = container.get<ICommandHandler>(TYPES.CommandHandler);

commandList.addCommands([
  CardsLeft,
  DontUseJoker,
  Draw,
  Help,
  Konami,
  ListDesigns,
  PrintMaximized,
  PrintMinimized,
  SetDesign,
  SetPrefix,
  Shuffle,
  UseJoker,
  UseStandardDeck,
  UseStrippedDeck
]);
