import { Command } from './command';
import { AnswerColor } from '../answer-color';

/**
 * Command !useJoker
 * Add joker to the next deck
 */
export class UseJoker extends Command {
  /**
   * @inheritDoc
   */
  public name: string[] = [ 'useJoker', 'usejoker' ];

  /**
   * Command !useJoker
   * Add joker to the next deck
   *
   * @inheritDoc
   */
  public run(commandName: string, params: string): void {
    this.logCommand('useJoker', commandName, params);
    this.curGuild.getConfig().useJoker();
    this.saveGuildConfig();

    this.replyConfigChange('Use joker', 'added joker to the next deck.');
  }

  /**
   * @inheritDoc
   */
  public help(): void {
    this.setAuthor('Help Use Joker', 'use-joker');
    this.answer
      .setTitle('Use Joker')
      .setColor(AnswerColor.info)
      .setDescription('Add joker to the decks with `useJoker`. You have to shuffle to make it effective.')
      .addField('Other Commands', 'You could also use `usejoker`.');
    this.sendAnswer();
  }
}
