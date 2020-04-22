import { inject, injectable } from 'inversify';
import { Guild } from '../guild/guild';
import { Message, MessageEmbed } from 'discord.js';
import { CommandDeterminer } from './command-determiner';
import { TYPES } from '../types';
import { Card } from '../deck/card';
import { capitalize, transformToNum } from '../functions';
import { DeckTypes } from '../deck/deck-types';

@injectable()
export class CommandHandler{
  private cmdDeterminer: CommandDeterminer;
  private readonly msgFactory: () => MessageEmbed;
  private curGuild: Guild;
  private curMessage: Message;
  private answer: MessageEmbed;
  private commands: Map<string, (string) => string>;

  constructor(
    @inject(TYPES.CommandDeterminer) cmdDeterminer: CommandDeterminer,
    @inject(TYPES.MessageFactory) msgFactory: () => MessageEmbed//interfaces.Factory<Answer>
  ) {
    this.cmdDeterminer = cmdDeterminer
    this.msgFactory = msgFactory;
    this.initCommands();
  }

  public handle(msg: Message, curGuild: Guild): void {
    this.curGuild = curGuild;
    this.curMessage = msg;

    this._handle();
  }

  /**
   * Command !shuffle
   *
   * @return string answer
   */
  private shuffle(): string {
    this.curGuild.getDeck().shuffle(this.curGuild.getConfig().getDeckType(), this.curGuild.getConfig().getJoker());

    let answer = 'shuffled ' + this.curGuild.getConfig().getDeckType();

    if (this.curGuild.getConfig().getJoker()) {
      answer += ' with joker';
    }

    return answer;
  }

  /**
   * Command !draw
   *
   * @param numString: string, how much cards you want to draw. Default is 1.
   *
   * @return string answer
   */
  private draw(numString: string = ''): string {
    if (undefined === this.curGuild.getDeck()) {
      return 'out of cards';
    }

    const num = transformToNum(numString);
    let first = true;
    let answer: string = '';
    for (let i = num; i > 0; --i) {
      const card: Card = this.curGuild.getDeck().draw();
      if (undefined === card) {
        if (!first) {
          answer += '\n  ';
        }
        return answer + 'out of cards';
      }
      if (first) {
        answer += 'got the card(s):';
        first = !first;
      }
      answer += '\n  :' +
        card.getSuit() +
        ':(' +
        capitalize(card.getSuit()) +
        ') ' +
        capitalize(card.getRank());
    }

    return answer;
  }

  /**
   * Command !useStandardDeck
   *
   * @return string answer
   */
  private useStandardDeck(): string {
    this.curGuild.getConfig().setDeckType(DeckTypes.standardDeck);

    return 'from next shuffle on a standard deck (52 cards) will be used';
  }

  /**
   * Command !useStrippedDeck
   *
   * @return string answer
   */
  private useStrippedDeck(): string {
    this.curGuild.getConfig().setDeckType(DeckTypes.strippedDeck);

    return 'from next shuffle on a stripped deck (32 cards) will be used';
  }

  /**
   * Command !userJoker
   *
   * @return string answer
   */
  private useJoker(): string {
    this.curGuild.getConfig().useJoker();

    return 'from now on there are joker in the decks';
  }

  /**
   * Command !dontUseJoker
   *
   * @return string answer
   */
  private dontUseJoker(): string {
    this.curGuild.getConfig().dontUseJoker();

    return 'from now on there aren\'t joker in the decks';
  }

  /**
   * Command !newPrefix
   *
   * @param newPrefix
   *
   * @return string answer
   */
  private setPrefix(newPrefix: string): string {
    if ('' === newPrefix) {
      newPrefix = '!';
    }
    this.curGuild.getConfig().setPrefix(newPrefix);

    return 'prefix changed to \'' + newPrefix + '\'';
  }

  /**
   * Command help
   *
   * @return string help info
   */
  private static help() {
    return '\n> # Draw Cards\n' +
      '> a bot for drawing random cards\n' +
      '> **Available commands:**\n' +
      '> *!shuffle*\n' +
      '> shuffle the hole deck new\n' +
      '> \n' +
      '> *!draw [?num]*\n' +
      '> draw [num] cards of the deck. If nothing is set or the value is not valid it uses 1.\n' +
      '> \n' +
      '> *!useStandardDeck*\n' +
      '> use standard (52 cards) deck (active from next shuffle on)\n' +
      '> \n' +
      '> *!useStrippedDeck*\n' +
      '> use stripped (32 cards) deck (active from next shuffle on)\n' +
      '> \n' +
      '> *!useJoker*\n' +
      '> add joker to the decks (active from next shuffle on)\n' +
      '> \n' +
      '> *!dontUseJoker*\n' +
      '> don\'t add joker to the decks (active from next shuffle on)\n' +
      '> \n' +
      '> *!setPrefix [?newPrefix]*\n' +
      '> set the prefix from \'!\' to another. if no parameter is set, it changes back to \'!\'\n' +
      '> \n' +
      '> *!help*\n' +
      '> get this help information\n' +
      '> \n' +
      '> ## more Infos\n' +
      '> Github: https://github.com/Vogaeael/drawCards'
  }

  /**
   * Init the commands:
   * - shuffle
   * - draw
   * - useStandardDeck
   * - useStrippedDeck
   * - useJoker
   * - dontUseJoker
   * - setPrefix
   * - help
   */
  private initCommands(): void {
    this.commands = new Map<string, (string) => string>();
    this.commands.set('shuffle', (_: string) => {
      return this.shuffle();
    });
    this.commands.set('draw', (num: string) => {
      return this.draw(num);
    });
    this.commands.set('useStandardDeck', (_: string) => {
      return this.useStandardDeck();
    });
    this.commands.set('useStrippedDeck', (_: string) => {
      return this.useStrippedDeck();
    });
    this.commands.set('useJoker', (_: string) => {
      return this.useJoker();
    });
    this.commands.set('dontUseJoker', (_: string) => {
      return this.dontUseJoker();
    });
    this.commands.set('setPrefix', (newPrefix: string) => {
      return this.setPrefix(newPrefix);
    });
    this.commands.set('help', (_: string) => {
      return CommandHandler.help();
    });
  }

  private _handle(): void {
    this.initAnswer();

    const commandAndParams = this.cmdDeterminer.handle(
      this.commands,
      this.curMessage.content,
      this.curGuild.getConfig().getPrefix());

    if (commandAndParams) {
      this.curMessage.reply(commandAndParams[0](commandAndParams[1]));
    }
  }

  private initAnswer(): void {
    this.answer = this.msgFactory();
    // @TODO add other things like author
  }
}
