import { Command } from './command';
import { capitalize, transformToNum } from '../../functions';
import { AnswerColor } from '../answer-color';
import { ICard } from '../../deck/card';
import { Joker } from '../../deck/deck-types';
import { Suits } from '../../deck/suits';

export class Draw extends Command {
  public run(numString: string): void {
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
    this.initAnswer();
    this.answer.setTitle('Draw Card');
    this.answer.setDescription(this.getMentionOfAuthor() + ' got the cards:');

    let fieldsToAdd = [];
    let hasBlack = false;
    let hasRed = false;
    let countMessage = 1;
    for (let i = num; i > 0; --i) {
      if (25 * countMessage <= num - i) {
        ++countMessage;
        this.setDrawColor(hasRed, hasBlack);
        this.answer.addFields(fieldsToAdd);
        this.sendAnswer();
        hasRed = false;
        hasBlack = false;
        fieldsToAdd = [];
        this.initAnswer();
      }
      const card: ICard = this.curGuild.getDeck().draw();
      if (undefined === card) {
        this.setDrawColor(hasRed, hasBlack);
        fieldsToAdd.push(
          {
            'name': 'Draw Card',
            'value': 'Sorry but the deck is empty. ' + i + ' cards remaining'
          }
        );
        this.answer.addFields(fieldsToAdd);
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
}
