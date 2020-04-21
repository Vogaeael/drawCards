import { Deck } from '../deck/deck';
import { GuildConfig } from './guild-config';
import { Message, Snowflake } from "discord.js";
import { Card } from '../deck/card';
import { capitalize } from '../functions';
import { CommandHandler } from '../command-handler';
import { DeckTypes } from '../deck/deck-types';

// @injectable()
export class Guild {
  private cmdHandler: CommandHandler;
  private id: Snowflake;
  private deck: Deck;
  private config: GuildConfig;
  private commands: Map<string, (string) => string>;

  public constructor(
    // @inject(TYPES.CommandHandler)
    cmdHandler: CommandHandler,
    id: Snowflake
  ) {
    this.cmdHandler = cmdHandler;
    this.id = id;
    this.config = new GuildConfig();
    this.initCommands();
    this.initDeck();
  }

  /**
   * handle the message
   *
   * @param msg: Message
   */
  public handleMessage(msg: Message): void {
    const answer: string = this.cmdHandler.handle(
      this.commands,
      msg.content,
      this.config.getPrefix()
    );

    if (answer) {
      msg.reply(answer);
    }
  }

  /**
   * Command !shuffle
   *
   * @return string answer
   */
  private shuffle(): string {
    this.deck.shuffle(this.config.getDeckType(), this.config.getJoker());

    return 'shuffled Deck';
  }

  /**
   * Command !draw
   *
   * @param numString: string, how much cards you want to draw. Default is 1.
   *
   * @return string answer
   */
  private draw(numString: string = ''): string {
    if (undefined === this.deck) {
      return 'out of cards';
    }

    const num = Guild.transformToNum(numString);
    let first = true;
    let answer: string = '';
    for (let i = num; i > 0; --i) {
      const card: Card = this.deck.draw();
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
      answer += '\n  :'+ card.getSuit() + ':(' + capitalize(card.getSuit()) + ') ' + capitalize(card.getRank());
    }

    return answer;
  }

  /**
   * Command !useStandardDeck
   *
   * @return string answer
   */
  private useStandardDeck(): string {
    this.config.setDeckType(DeckTypes.standardDeck);

    return 'from next shuffle on a standard deck (52 cards) will be used';
  }

  /**
   * Command !useStrippedDeck
   *
   * @return string answer
   */
  private useStrippedDeck(): string {
    this.config.setDeckType(DeckTypes.strippedDeck);

    return 'from next shuffle on a stripped deck (32 cards) will be used';
  }

  /**
   * Command !userJoker
   *
   * @return string answer
   */
  private useJoker(): string {
    this.config.useJoker();

    return 'from now on there are joker in the decks';
  }

  /**
   * Command !dontUseJoker
   *
   * @return string answer
   */
  private dontUseJoker(): string {
    this.config.dontUseJoker();

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
    this.config.setPrefix(newPrefix);

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
      return Guild.help();
    });
  }

  private initDeck(): void {
    this.deck = new Deck();
  }

  private static transformToNum(numString: string): number {
    let num: number = +numString;
    if (!num || num <= 0) {
      num = 1;
    }

    return num;
  }
}
