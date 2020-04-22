import { inject, injectable } from 'inversify';
import { Guild } from '../guild/guild';
import { Message, MessageEmbed } from 'discord.js';
import { CommandDeterminer } from './command-determiner';
import { TYPES } from '../types';
import { Card } from '../deck/card';
import { capitalize, transformToNum } from '../functions';
import { DeckTypes } from '../deck/deck-types';
import { AnswerColor } from './answer-color';
import { Suits } from '../deck/suits';

export type Command = (string) => void;

@injectable()
export class CommandHandler{
  private cmdDeterminer: CommandDeterminer;
  private readonly msgFactory: () => MessageEmbed;
  private curGuild: Guild;
  private curMessage: Message;
  private answer: MessageEmbed;
  private commands: Map<string, (string) => void>;

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
   */
  private shuffle(): void {
    this.curGuild.getDeck().shuffle(this.curGuild.getConfig().getDeckType(), this.curGuild.getConfig().getJoker());

    let description = this.getMentionOfAuthor() + ' shuffled ' + this.curGuild.getConfig().getDeckType();
    if (this.curGuild.getConfig().getJoker()) {
      description += ' with joker';
    }

    this.answer.setTitle('Shuffle')
      .setDescription(description)
      .setColor(AnswerColor.reply_info);
  }

  /**
   * Command !draw
   *
   * @param numString: string, how much cards you want to draw. Default is 1.
   */
  private draw(numString: string = ''): void {
    this.answer.setTitle('Draw Card');
    if (undefined === this.curGuild.getDeck()) {
      this.answer.setDescription('Out of cards.')
        .setColor(AnswerColor.reply_info);
      return
    }

    let hasRed = false;
    let hasBlack = false;
    const num = transformToNum(numString);
    for (let i = num; i > 0; --i) {
      const card: Card = this.curGuild.getDeck().draw();
      if (undefined === card) {
        this.setDrawColor(hasRed, hasBlack);
        this.answer.addField('Out of Cards', 'Sorry ' + this.getMentionOfAuthor() + ', the deck is out of cards.');

        return
      }

      this.answer.setDescription(this.getMentionOfAuthor() + ' got the cards:');
      if (card.getSuit() === Suits.clubs || card.getSuit() === Suits.spades) {
        hasBlack = true;
      }
      if (card.getSuit() === Suits.diamonds || card.getSuit() === Suits.hearts) {
        hasRed = true;
      }

      this.answer.addField(
        ':' +
        card.getSuit() +
        ': ' +
        capitalize(card.getRank()),
        capitalize(card.getSuit()) +
        ' ' +
        capitalize(card.getRank()),
        true);
    }

    this.setDrawColor(hasRed, hasBlack);
  }

  /**
   * Command !useStandardDeck
   */
  private useStandardDeck(): void {
    this.curGuild.getConfig().setDeckType(DeckTypes.standardDeck);

    this.answer.setTitle('Use standard deck')
      .setDescription(this.getMentionOfAuthor() + ' changed the next deck to a standard deck (52 cards).')
      .setColor(AnswerColor.reply_info);
  }

  /**
   * Command !useStrippedDeck
   */
  private useStrippedDeck(): void {
    this.curGuild.getConfig().setDeckType(DeckTypes.strippedDeck);

    this.answer.setTitle('Use stripped deck')
      .setDescription(this.getMentionOfAuthor() + ' changed the next deck to a stripped deck (32 cards).')
      .setColor(AnswerColor.reply_info);
  }

  /**
   * Command !userJoker
   */
  private useJoker(): void {
    this.curGuild.getConfig().useJoker();

    this.answer.setTitle('Use joker')
      .setDescription(this.getMentionOfAuthor() + ' add joker to the next deck.')
      .setColor(AnswerColor.reply_info);
  }

  /**
   * Command !dontUseJoker
   */
  private dontUseJoker(): void {
    this.curGuild.getConfig().dontUseJoker();

    this.answer.setTitle('Don\'t use joker')
      .setDescription(this.getMentionOfAuthor() + ' remove joker from the next deck.')
      .setColor(AnswerColor.reply_info);
  }

  /**
   * Command !newPrefix
   *
   * @param newPrefix
   */
  private setPrefix(newPrefix: string): void {
    if ('' === newPrefix) {
      newPrefix = '!';
    }
    this.curGuild.getConfig().setPrefix(newPrefix);

    this.answer.setTitle('Prefix changed')
      .setDescription(this.getMentionOfAuthor() + ' changed prefix to ' + newPrefix + '.')
      .setColor(AnswerColor.reply_info);
  }

  /**
   * Command !help
   */
  private help(): void {
    this.answer.setTitle('Draw Cards')
      .setDescription('Bot to shuffle a deck and draw cards from it.')
      .setURL('https://github.com/Vogaeael/drawCards')
      .setColor(AnswerColor.info)
      .addField('!shuffle', 'Shuffle the hole deck new.')
      .addField('!draw [?num]', 'Draw [num] cards of the deck. If nothing is set or the value is not valid it uses 1.')
      .addField('!useStandardDeck', 'Use standard (52 cards) deck (active from next shuffle on).')
      .addField('!useStrippedDeck', 'Use stripped (32 cards) deck (active from next shuffle on).')
      .addField('!useJoker', 'Add joker to the decks (active from next shuffle on).')
      .addField('!dontUseJoker', 'don\'t add joker to the decks (active from next shuffle on).')
      .addField('!setPrefix [?newPrefix]', 'set the prefix from \'!\' to another. If no parameter is set, it changes back to \'!\'')
      .addField('!help', 'Get this help information');
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
    this.commands = new Map<string, (string) => void>();
    this.commands.set('shuffle', (_: string) => {
      this.shuffle();
    });
    this.commands.set('draw', (num: string) => {
      this.draw(num);
    });
    this.commands.set('useStandardDeck', (_: string) => {
      this.useStandardDeck();
    });
    this.commands.set('useStrippedDeck', (_: string) => {
      this.useStrippedDeck();
    });
    this.commands.set('useJoker', (_: string) => {
      this.useJoker();
    });
    this.commands.set('dontUseJoker', (_: string) => {
      this.dontUseJoker();
    });
    this.commands.set('setPrefix', (newPrefix: string) => {
      this.setPrefix(newPrefix);
    });
    this.commands.set('help', (_: string) => {
      this.help();
    });
  }

  private _handle(): void {
    this.initAnswer();

    const commandAndParams = this.cmdDeterminer.handle(
      this.commands,
      this.curMessage.content,
      this.curGuild.getConfig().getPrefix());

    const command: (string) => void = commandAndParams[0];
    const params: string = commandAndParams[1];

    if (commandAndParams) {
      command(params);
      this.curMessage.channel.send(this.answer);
    }
  }

  /**
   * Initialize the answer
   */
  private initAnswer(): void {
    this.answer = this.msgFactory();
  }

  /**
   * Set the answer color to one of AnswerColor
   *
   * | red | black |     color      |
   * ----+-----+-----------------
   * |  0  |   0   | red_black_card |
   * |  0  |   1   |   black_card   |
   * |  1  |   0   |    red_card    |
   * |  1  |   1   | red_black_card |
   *
   * @param red
   * @param black
   */
  private setDrawColor(red: boolean, black: boolean): void {
    let color = AnswerColor.red_black_cards;
    if (!red && black) {
      color = AnswerColor.black_card;
    }
    if (red && !black) {
      color = AnswerColor.red_card;
    }

    this.answer.setColor(color);
  }

  /**
   * Get the mention of the author
   * For example <@12345678901234567>
   */
  private getMentionOfAuthor(): string {
    return '<@' + this.curMessage.author.id + '>';
  }
}
