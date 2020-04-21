import { Deck } from '../deck/deck';
import { GuildConfig } from './guild-config';
import { Message, Snowflake } from "discord.js";
import { Card } from '../deck/card';
import { capitalize } from '../functions';

export class Guild {
  private id: Snowflake;
  private deck: Deck;
  private config: GuildConfig;

  public constructor(id: Snowflake) {
    this.id = id;
    this.config = new GuildConfig();
    this.initDeck();
  }

  public handleMessage(msg: Message): void {
    let returnMsg = undefined;
    switch(msg.content) {
      case this.config.getPrefix() + 'shuffle':
        returnMsg = this.shuffle();
        break;
      case this.config.getPrefix() + 'draw':
        returnMsg = this.draw();
        break;
      case this.config.getPrefix() + 'help':
        returnMsg = Guild.help();
        break;
    }

    if (undefined !== returnMsg) {
      msg.reply(returnMsg);
    }
    //
    // const func = this.deck.draw();
    //
    // msg.reply(() => { return func()});
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
