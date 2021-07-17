import { Command } from './command';
import { transformToNum } from '../../functions';

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
    this.sendShortHelp(
      'Help Shuffle',
      'Command to shuffle a new deck. You can add a number to shuffle more than one time, but the maximum is ' + this.MAX_SHUFFLE
      + ' If the config was changed to a new deck, or the config if joker should be in the deck or not was changed, the new deck will have the changes.');
  }
}
