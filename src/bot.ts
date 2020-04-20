import {
  Client,
  Message
} from "discord.js";
import {
  inject,
  injectable
} from "inversify";
import { TYPES } from './types';
import { Deck } from './deck/deck';
import { Card } from './deck/card';
import { MesssageResponder } from ".services/message-responder";

@injectable()
export class Bot {
  private client: Client;
  private config;
  private readonly prefix = '!';
  private readonly token: string;
  private decks: Deck[];

  constructor(
    @inject(TYPES.Client) client: Client,
    @inject(TYPES.Token) token: string,
  ) {
    this.client = client;
    this.token = token;
    this.initDecks();
  }

  public listen(): Promise<string> {
    this.client.on('message', (msg: Message) => {
      const guildID = msg.guild.id;
      switch(msg.content) {
        case this.prefix + 'shuffle':
          msg.reply(this.shuffle(guildID));
          break;
        case this.prefix + 'draw':
          msg.reply(this.draw(guildID));
          break;
        case this.prefix + 'help':
          msg.reply(this.help());
          break;
      }
    })

    return this.client.login(
      this.token
    );
  }

  private shuffle(guildID): string {
    this.initDeck(guildID)

    return 'shuffled Deck';
  }

  private draw(guildID): string {
    const deck: Deck = this.decks[guildID];
    if (undefined === deck) {
      return 'out of cards';
    }

    const card: Card = deck.draw();
    if (undefined === card) {
      return 'out of cards';
    }

    return 'got a :' + card.getSuit() + ':(' + capitalize(card.getSuit()) + ') ' + capitalize(card.getRank());
  }

  private initDeck(guildID) {
    this.decks[guildID] = new Deck();
  }

  private initDecks() {
    this.decks = [];
  }

  help() {
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



// private static loadConfig(): void {
  //   this.config = YAML.load(path.resolve(__dirname, 'settings.yml'))
  // }
}

function capitalize(word: string) {
  if (!word) {
    return word;
  }

  return word[0].toUpperCase() + word.substr(1).toLowerCase();
}
