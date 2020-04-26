import { Command } from './command';
import { capitalize, transformToNum } from '../../functions';
import { AnswerColor } from '../answer-color';
import { ICard } from '../../deck/card';
import { Joker } from '../../deck/deck-types';
import { Suits } from '../../deck/suits';
import { EmbedFieldData, Message } from 'discord.js';
import { IGuild } from '../../guild/guild';

/**
 * Command !draw
 * Draw a card of the deck
 */
export class Draw extends Command {
  private static readonly max_fields_in_message: number = 25;
  private fieldsToAdd: EmbedFieldData[];
  private countAnswers: number;
  private hasRed: boolean;
  private hasBlack: boolean;

  /**
   * Command !draw
   * Draw a card of the deck
   *
   * @inheritDoc
   */
  public run(numString: string): void {
    this.logCommand('draw', numString);
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

  public init(guild: IGuild, msg: Message): void {
    super.init(guild, msg);
    this.initFieldsToAdd();
    this.initColors();
    this.countAnswers = 1;
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
   */
  private setDrawColor(): void {
    let color = AnswerColor.red_black_cards;
    if (!this.hasRed && this.hasBlack) {
      color = AnswerColor.black_card;
    }
    if (this.hasRed && !this.hasBlack) {
      color = AnswerColor.red_card;
    }

    this.answer.setColor(color);
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
   * Answer that the deck it empty
   *
   * @param num: number, number of remaining cards
   */
  private answerEmpty(num: number = null): void {
    let description = 'sorry but the deck is empty.';
    if (num) {
      description += ' ' + num + ' cards remaining.';
    }
    this.replyConfigChange('Draw Card', description);
  }

  /**
   * Draw cards and answer one message for all
   *
   * @param num: number, the number of cards to draw
   */
  private drawMinimized(num: number): void {
    this.answer.setTitle('Draw Card');
    this.answer.setDescription(this.getMentionOfAuthor() + ' got the cards:');

    for (let i = num; i > 0; --i) {
      this.sendInBetweenAnswer(num - i);
      const card: ICard = this.curGuild.getDeck().draw();
      if (undefined === card) {
        this.fieldsToAdd.push(
          {
            'name': 'Draw Card',
            'value': 'Sorry but the deck is empty. ' + i + ' cards remaining'
          }
        );
        this.sendMinimizedAnswer();

        return
      }

      this.updateColor(card.getSuit());

      this.fieldsToAdd.push(
        {
          'name': ':' + card.getSuit() + ': ' + capitalize(card.getRank()),
          'value': capitalize(card.getSuit()) + ' ' + capitalize(card.getRank())
        });
    }

    this.sendMinimizedAnswer();
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
        this.answerEmpty(i);

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
   * Send messages in between to not get over the max value of fields in a message
   *
   * @param numFields: number, the number of fields at the moment
   */
  private sendInBetweenAnswer(numFields: number): void {
    if (Draw.max_fields_in_message * this.countAnswers <= numFields) {
      ++this.countAnswers;
      this.sendMinimizedAnswer();
      this.initNextAnswer();
    }
  }

  /**
   * Update if the color should have red or black
   *
   * @param suit: string
   */
  private updateColor(suit: string): void {
    if (suit === Suits.clubs || suit === Suits.spades) {
      this.hasBlack = true;
    }

    if (suit === Suits.diamonds || suit === Suits.hearts) {
      this.hasRed = true;
    }
  }

  /**
   * Initialize the next answer
   */
  private initNextAnswer(): void {
    this.initFieldsToAdd();
    this.initColors();
    this.initAnswer();
  }

  /**
   * Initialize fields to add
   */
  private initFieldsToAdd(): void {
    this.fieldsToAdd = [];
  }

  /**
   * Initialize the attributes hasRed and hasBlack
   */
  private initColors(): void {
    this.hasBlack = false;
    this.hasRed = false;
  }

  private sendMinimizedAnswer(): void {
    this.setDrawColor();
    this.answer.addFields(this.fieldsToAdd);
    this.sendAnswer();
  }
}
