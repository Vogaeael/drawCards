import { Deck } from '../deck/deck';
import { GuildConfig } from './guild-config';
import { Message, Snowflake } from "discord.js";
import { Card } from '../deck/card';
import { capitalize } from '../functions';
import { inject, injectable } from 'inversify';
import { CommandHandler } from '../command-handler';
import { TYPES } from '../types';

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
    this.deck.shuffle(this.config.getJoker());

    return 'shuffled Deck';
  }

  /**
   * Command !draw
   *
   * @return string answer
   */
  private draw(): string {
    if (undefined === this.deck) {
      return 'out of cards';
    }

    const card: Card = this.deck.draw();
    if (undefined === card) {
      return 'out of cards';
    }

    return 'got a :' + card.getSuit() + ':(' + capitalize(card.getSuit()) + ') ' + capitalize(card.getRank());
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
      '> *!draw*\n' +
      '> draw a card of the deck\n' +
      '> \n' +
      '> *!useJoker\n' +
      '> add joker to the decks (active from next shuffle on)\n' +
      '> \n' +
      '> *!dontUseJoker\n' +
      '> don\'t add joker to the decks (active from next shuffle on)\n' +
      '> \n' +
      '> *!setPrefix [?newPrefix]\n' +
      '> set the prefix from \'!\' to another. if no parameter is set, it changes back to \'!\'\n' +
      '\n' +
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
   * - setPrefix
   * - useJoker
   * - dontUseJoker
   * - help
   */
  private initCommands(): void {
    this.commands = new Map<string, (string) => string>();
    this.commands.set('shuffle', (_: string) => {
      return this.shuffle();
    });
    this.commands.set('draw', (_: string) => {
      return this.draw();
    });
    this.commands.set('setPrefix', (newPrefix: string) => {
      return this.setPrefix(newPrefix);
    });
    this.commands.set('useJoker', (_: string) => {
      return this.useJoker();
    });
    this.commands.set('dontUseJoker', (_: string) => {
      return this.dontUseJoker();
    });
    this.commands.set('help', (_: string) => {
      return Guild.help();
    });
  }

  private initDeck(): void {
    this.deck = new Deck();
  }
}
