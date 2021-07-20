import { Command } from './command';
import { AnswerColor } from '../answer-color';

/**
 * Command !dontUseJoker
 * Remove the joker from the next deck
 */
export class DontUseJoker extends Command {

  /**
   * @inheritDoc
   */
  public name: string[] = [ 'dontUseJoker', 'dontusejoker' ];

  /**
   * Command !dontUseJoker
   * Remove the joker from the next deck
   *
   * @inheritDoc
   */
  public run(commandName: string, params: string): void {
    this.logCommand('dontUseJoker', commandName, params);
    this.curGuild.getConfig().dontUseJoker();
    this.saveGuildConfig();

    this.replyConfigChange('Don\'t use joker', 'removed joker from the next deck.')
  }

  /**
   * @inheritDoc
   */
  public help(): void {
    this.setAuthor('Help Dont Use Joker', 'dont-use-joker');
    this.answer
      .setTitle('Dont Use Joker')
      .setColor(AnswerColor.info)
      .setDescription('With `dontUseJoker` you remove the joker from the future decks. You have to shuffle to have a deck without joker.')
      .addField('Other Commands', 'You could also use `dontusejoker`');
    this.sendAnswer();
  }
}
