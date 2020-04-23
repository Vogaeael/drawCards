import { inject, injectable } from 'inversify';
import { IGuild } from '../guild/guild';
import { Message, MessageEmbed } from 'discord.js';
import { ICommandDeterminer } from './command-determiner';
import { TYPES } from '../types';
import { ICard } from '../deck/card';
import { capitalize, transformToNum } from '../functions';
import { DeckTypes, Joker } from '../deck/deck-types';
import { AnswerColor } from './answer-color';
import { Suits } from '../deck/suits';

export type Command = (string) => void;

export interface ICommandHandler {
  /**
   * Handle the message
   *
   * @param msg
   * @param curGuild
   */
  handle(
    msg: Message,
    curGuild: IGuild
  ): void
}

@injectable()
export class CommandHandler implements ICommandHandler {
  private cmdDeterminer: ICommandDeterminer;
  private readonly msgFactory: () => MessageEmbed;
  private curGuild: IGuild;
  private curMessage: Message;
  private answer: MessageEmbed;
  private commands: Map<string, (string) => void>;

  constructor(
    @inject(TYPES.CommandDeterminer) cmdDeterminer: ICommandDeterminer,
    @inject(TYPES.MessageFactory) msgFactory: () => MessageEmbed//interfaces.Factory<Answer>
  ) {
    this.cmdDeterminer = cmdDeterminer
    this.msgFactory = msgFactory;
    this.initCommands();
  }

  /**
   * @inheritDoc
   */
  public handle(msg: Message, curGuild: IGuild): void {
    this.curGuild = curGuild;
    this.curMessage = msg;

    this._handle();
  }

  /**
   * Command !shuffle
   */
  private shuffle(): void {
    this.curGuild.getDeck().shuffle(this.curGuild.getConfig().getDeckType(), this.curGuild.getConfig().getJoker());

    let description = 'shuffled ' + this.curGuild.getConfig().getDeckType();
    if (this.curGuild.getConfig().getJoker()) {
      description += ' with joker';
    }

    this.replyConfigChange('Shuffle', description);
  }

  /**
   * Command !draw
   *
   * @param numString: string, how much cards you want to draw. Default is 1.
   */
  private draw(numString: string = ''): void {
    if (undefined === this.curGuild.getDeck()) {
      this.answerEmpty();

      return
    }

    if ('all' === numString.trim()) {
      numString = '' + this.curGuild.getDeck().count();
    }

    const num = transformToNum(numString);

    if (this.curGuild.getConfig().getMinimized()) {
      this.drawMinimized(num);

      return
    }

    this.drawMaximized(num);
  }

  /**
   * Command !useStandardDeck
   */
  private useStandardDeck(): void {
    this.curGuild.getConfig().setDeckType(DeckTypes.standardDeck);

    this.replyConfigChange('Use standard deck', 'changed the next deck to a standard deck (52 cards).');
  }

  /**
   * Command !useStrippedDeck
   */
  private useStrippedDeck(): void {
    this.curGuild.getConfig().setDeckType(DeckTypes.strippedDeck);

    this.replyConfigChange('Use stripped deck', 'changed the next deck to a stripped deck (32 cards).');
  }

  /**
   * Command !userJoker
   */
  private useJoker(): void {
    this.curGuild.getConfig().useJoker();

    this.replyConfigChange('Use joker', 'added joker to the next deck.');
  }

  /**
   * Command !dontUseJoker
   */
  private dontUseJoker(): void {
    this.curGuild.getConfig().dontUseJoker();

    this.replyConfigChange('Don\'t use joker', 'removed joker from the next deck.')
  }

  /**
   * Command !printMinimized
   */
  private printMinimized(): void {
    this.curGuild.getConfig().printMinimized();

    this.replyConfigChange('Minimize draw answers', 'minimized the draw answers.');
  }

  /**
   * Command !printMaximized
   */
  private printMaximized(): void {
    this.curGuild.getConfig().printMaximized();

    this.replyConfigChange('Maximized draw answers', 'maximized the draw answers.');
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

    this.replyConfigChange('Prefix changed', 'changed prefix to ' + newPrefix + '.');
  }

  /**
   * Command !help
   */
  private help(): void {
    this.initAnswer();
    this.answer.setTitle('Draw Cards')
      .setDescription('Bot to shuffle a deck and draw cards from it.')
      .setURL('https://github.com/Vogaeael/drawCards')
      .attachFiles(['./media/images/deck_icons.png'])
      .setThumbnail('attachment://deck_icons.png')
      .setColor(AnswerColor.info)
      .addField('!shuffle', 'Shuffle the hole deck new.')
      .addField('!draw [?num]', 'Draw [num] cards of the deck. If nothing is set or the value is not valid it uses 1. Instead of a number, you can also say `all`')
      .addField('!useStandardDeck', 'Use standard (52 cards) deck (active from next shuffle on).')
      .addField('!useStrippedDeck', 'Use stripped (32 cards) deck (active from next shuffle on).')
      .addField('!useJoker', 'Add joker to the decks (active from next shuffle on).')
      .addField('!dontUseJoker', 'Don\'t add joker to the decks (active from next shuffle on).')
      .addField('!printMinimized', 'Print the answer from draw minimized.')
      .addField('!printMaximized', 'Print the answer from draw maximized.')
      .addField('!setPrefix [?newPrefix]', 'Set the prefix from `!` to another. If no parameter is set, it changes back to `!`')
      .addField('!help', 'Get this help information');
    this.sendAnswer();
  }

  /**
   * Init the commands:
   * - shuffle
   * - draw
   * - useStandardDeck
   * - useStrippedDeck
   * - useJoker
   * - dontUseJoker
   * - printMinimized
   * - printMaximized
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
    this.commands.set('printMinimized', (_: string) => {
      this.printMinimized();
    });
    this.commands.set('printMaximized', (_: string) => {
      this.printMaximized();
    });
    this.commands.set('setPrefix', (newPrefix: string) => {
      this.setPrefix(newPrefix);
    });
    this.commands.set('help', (_: string) => {
      this.help();
    });
  }

  /**
   * Handle the message
   */
  private _handle(): void {
    const commandAndParams = this.cmdDeterminer.handle(
      this.commands,
      this.curMessage.content,
      this.curGuild.getConfig().getPrefix());

    if (commandAndParams) {
      const command: (string) => void = commandAndParams[0];
      const params: string = commandAndParams[1];
      command(params);
    }
  }

  /**
   * Draw cards and answer one message for all
   *
   * @param num: number, the number of cards to draw
   */
  private drawMinimized(num: number): void {
    this.initAnswer();
    this.answer.setTitle('Draw Card');
    this.answer.setDescription(this.getMentionOfAuthor() + ' got the cards:');

    let fieldsToAdd = [];
    let hasBlack = false;
    let hasRed = false;
    for (let i = num; i > 0; --i) {
      const card: ICard = this.curGuild.getDeck().draw();
      if (undefined === card) {
        this.setDrawColor(hasRed, hasBlack);
        this.answer.addFields(fieldsToAdd);
        this.answer.addField('Draw Card', 'Sorry but the deck is empty.');
        this.sendAnswer();

        return
      }

      if (card.getSuit() === Suits.clubs || card.getSuit() === Suits.spades) {
        hasBlack = true;
      }

      if (card.getSuit() === Suits.diamonds || card.getSuit() === Suits.hearts) {
        hasRed = true;
      }

      fieldsToAdd.push(
        {
          'name': ':' + card.getSuit() + ': ' + capitalize(card.getRank()),
          'value': capitalize(card.getSuit()) + ' ' + capitalize(card.getRank())
        });
    }

    this.setDrawColor(hasRed, hasBlack);
    this.answer.addFields(fieldsToAdd);
    this.sendAnswer();
  }

  /**
   * Draw cards and answer everyone with its own image and message
   *
   * @param num: number, number of cards to draw
   */
  private drawMaximized(num: number): void {
    for (let i = num; i > 0; --i) {
      const card: ICard = this.curGuild.getDeck().draw();
      if (undefined === card) {
        this.answerEmpty();

        return
      }

      this.initAnswer();
      this.answer.setTitle('Draw Card :' + card.getSuit() + ': ' + capitalize(card.getRank()))
        .setDescription(
          this.getMentionOfAuthor() +
          ' draw card ' +
          capitalize(card.getSuit()) +
          ' ' +
          capitalize(card.getRank()));

      this.addCardImage(card);

      this.sendAnswer();
    }
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
   * Answer that the deck it empty
   */
  private answerEmpty(): void {
    this.replyConfigChange('Draw Card', 'sorry but the deck is empty');
  }

  /**
   * Reply to the change of the config
   *
   * @param title: string
   * @param description: string
   */
  private replyConfigChange(title: string, description: string): void {
    this.initAnswer();
    this.answer.setTitle(title)
      .setDescription(this.getMentionOfAuthor() + ' ' + description)
      .setColor(AnswerColor.config_reply);
    this.sendAnswer();
  }

  /**
   * Add an image for the card
   *
   * @param card: Card
   */
  private addCardImage(card: ICard): void {
    let fileName = 'deck_icons.png';
    let path = './media/images/';
    if (card.getRank() !== Joker.black_joker || card.getRank() !== Joker.black_joker2) {
      fileName = card.getRank() + '_' + card.getSuit() + '.png';
      path = './media/images/cards/';
    }

    this.answer.attachFiles([path + fileName]);
    this.answer.setImage('attachment://' + fileName);
  }

  /**
   * Send the current answer
   */
  private sendAnswer(): void {
    this.curMessage.channel.send(this.answer);
  }

  /**
   * Initialize the answer
   */
  private initAnswer(): void {
    this.answer = this.msgFactory();
  }

  /**
   * Get the mention of the author
   * For example <@12345678901234567>
   */
  private getMentionOfAuthor(): string {
    return '<@' + this.curMessage.author.id + '>';
  }
}
