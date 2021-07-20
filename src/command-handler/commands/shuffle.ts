import { Command } from './command';
import { transformToNum } from '../../functions';
import { AnswerColor } from '../answer-color';

/**
 * Command !shuffle
 * Shuffle a new deck
 */
export class Shuffle extends Command {
  /**
   * @inheritDoc
   */
  public name: string[] = [ 'shuffle' ];

  private readonly MAX_SHUFFLE: number = 8;

  /**
   * Command !shuffle
   * Shuffle a new deck
   *
   * @inheritDoc
   */
  public run(commandName: string, params: string): void {
    this.logCommand('shuffle', commandName, params);
    let numShuffles: number = transformToNum(params);
    numShuffles = Math.min(this.MAX_SHUFFLE, numShuffles);

    for (let i = numShuffles; i > 0; --i) {   // I know, more than one shuffle is useless
      this.curGuild.getDeck().shuffle(this.curGuild.getConfig().getDeckType(), this.curGuild.getConfig().getJoker());
    }

    const multiShuffle: string = 1 < numShuffles ? ' ' + numShuffles + ' times ' : '';
    let description: string = 'shuffled ' + this.curGuild.getConfig().getDeckType() + multiShuffle;
    if (this.curGuild.getConfig().getJoker()) {
      description += ' with joker';
    }

    this.replyConfigChange('Shuffle', description);
  }

  /**
   * @inheritDoc
   */
  public help(): void {
    this.setAuthor('Help Shuffle', 'shuffle');
    this.answer
      .setTitle('Shuffle')
      .setColor(AnswerColor.info)
      .setDescription('To shuffle the complete deck you can use `shuffle [?num]`.')
      .addField('Changes in Deck', 'If the config was changed to a new deck, or the config of the usage of joker' +
        ' was changed, the new deck will have the changes.')
      .addField('Param [?num]', 'To define how often you want to shuffle you can add a number after the command.' +
        ' If you don\'t add a number it will be shuffled only one time. The maximum of numbers to shuffle is ' + this.MAX_SHUFFLE)
      .addField('Examples', 'Here you can see some examples:\n' +
        '```\n' +
        'shuffle      # the deck will be shuffled one time.\n' +
        'shuffle 3    # the deck will be shuffled three times.\n' +
        'shuffle 999  # because eight is the max number\n' +
        '               it will be shuffled eight times.' +
        '```');
    this.sendAnswer();
  }
}
