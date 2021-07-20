import { Command } from './command';
import { DeckTypes } from '../../deck/deck-types';
import { AnswerColor } from '../answer-color';

/**
 * Command !useStrippedDeck
 * Change the next deck to a stripped deck
 */
export class UseStrippedDeck extends Command {
  /**
   * @inheritDoc
   */
  public name: string[] = [ 'useStrippedDeck', 'userstrippeddeck' ];

  /**
   * Command !useStrippedDeck
   * Change the next deck to a stripped deck
   *
   * @inheritDoc
   */
  public run(commandName: string, params: string): void {
    this.logCommand('useStrippedDeck', commandName, params);
    this.curGuild.getConfig().setDeckType(DeckTypes.strippedDeck);
    this.saveGuildConfig();

    this.replyConfigChange('Use stripped deck', 'changed the next deck to a stripped deck (32 cards).');
  }

  /**
   * @inheritDoc
   */
  public help(): void {
    this.setAuthor('Help Use Stripped Deck', 'use-stripped-deck');
    this.answer
      .setTitle('Use Stripped Deck')
      .setColor(AnswerColor.info)
      .setDescription('To use stripped (32 cards) deck use the command `useStrippedDeck`. You have to shuffle to make it effective.')
      .addField('Other Commands', 'You could also use `usestrippeddeck`.');
    this.sendAnswer();
  }
}
