import { Command } from './command';
import { DeckTypes } from '../../deck/deck-types';
import { AnswerColor } from '../answer-color';

/**
 * Command !useStandardDeck
 * Change the next deck to a standard deck
 */
export class UseStandardDeck extends Command {
  /**
   * @inheritDoc
   */
  public name: string[] = [ 'useStandardDeck', 'usestandarddeck' ];

  /**
   * Command !useStandardDeck
   * Change the next deck to a standard deck
   *
   * @inheritDoc
   */
  public run(commandName: string, params: string): void {
    this.logCommand('useStandardDeck', commandName, params);
    this.curGuild.getConfig().setDeckType(DeckTypes.standardDeck);
    this.saveGuildConfig();

    this.replyConfigChange('Use standard deck', 'changed the next deck to a standard deck (52 cards).');
  }

  /**
   * @inheritDoc
   */
  public help(): void {
    this.setAuthor('Help Use Standard Deck', 'use-standard-deck');
    this.answer
      .setTitle('Use Standard Deck')
      .setColor(AnswerColor.info)
      .setDescription('To use standard (52 cards) deck use the command `useStandardDeck`. You have to shuffle to make it effective.')
      .addField('Other Commands', 'You could also use `usestandarddeck`.');
    this.sendAnswer();
  }
}
