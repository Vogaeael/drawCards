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

  private initCommands(): void {
    this.commands = new Map<string, (string) => string>();
    this.commands.set('draw', (_: string) => {
      return this.draw();
    });
    this.commands.set('shuffle', (_: string) => {
      return this.shuffle();
    });
    this.commands.set('help', (_: string) => {
      return Guild.help();
    });
    // this.commands.set('setPrefix', (newPrefix: string) => {
    //
    // });
  }

  private shuffle(): string {
    this.deck.shuffle();

    return 'shuffled Deck';
  }

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

  private initDeck(): void {
    this.deck = new Deck();
  }

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
      '> *!help*\n' +
      '> get this help information\n' +
      '> \n' +
      '> ## more Infos\n' +
      '> Github: https://github.com/Vogaeael/drawCards'
  }
}
