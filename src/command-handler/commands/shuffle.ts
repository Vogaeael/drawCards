import { Command } from './command';

/**
 * Command !shuffle
 * Shuffle a new deck
 */
export class Shuffle extends Command {

  /**
   * Command !shuffle
   * Shuffle a new deck
   *
   * @inheritDoc
   */
  public run(params: string): void {
    this.curGuild.getDeck().shuffle(this.curGuild.getConfig().getDeckType(), this.curGuild.getConfig().getJoker());

    let description = 'shuffled ' + this.curGuild.getConfig().getDeckType();
    if (this.curGuild.getConfig().getJoker()) {
      description += ' with joker';
    }

    this.replyConfigChange('Shuffle', description);
  }
}
