import { Command } from './command';

/**
 * Command !shuffle
 * Shuffle a new deck
 */
export class Shuffle extends Command {
  /**
   * @inheritDoc
   */
  public name: string[] = [ 'shuffle' ];

  /**
   * Command !shuffle
   * Shuffle a new deck
   *
   * @inheritDoc
   */
  public run(commandName: string, params: string): void {
    this.logCommand('shuffle', params);
    this.curGuild.getDeck().shuffle(this.curGuild.getConfig().getDeckType(), this.curGuild.getConfig().getJoker());

    let description = 'shuffled ' + this.curGuild.getConfig().getDeckType();
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
      'Command to shuffle a new deck. If the config was changed to a new deck, or the config if joker should be in the deck or not was changed, the new deck will have the changes.');
  }
}
