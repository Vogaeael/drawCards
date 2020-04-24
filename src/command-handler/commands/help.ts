import { Command } from './command';
import { AnswerColor } from '../answer-color';

/**
 * Command !help
 * Print the help information
 */
export class Help extends Command {

  /**
   * Command !help
   * Print the help information
   *
   * @inheritDoc
   */
  public run(params: string): void {
    this.answer.setAuthor(
      'Draw Cards',
      'https://cdn.discordapp.com/avatars/701496633489096815/66f7d3f5e9a01a73022c71bd94d41811.png',
      'https://github.com/Vogaeael/drawCards')
      .setTitle('Draw Cards')
      .setDescription('Bot to shuffle a deck and draw cards from it.')
      .setURL('https://github.com/Vogaeael/drawCards')
      .attachFiles(['./media/images/deck_icons.png'])
      .setThumbnail('attachment://deck_icons.png')
      .setColor(AnswerColor.info)
      .addField('!shuffle', 'Shuffle the hole deck new.')
      .addField('!draw [?num]', 'Draw [num] cards of the deck. If nothing is set or the value is not valid it uses 1. Instead of a number, you can also say `all`')
      .addField('!useStandardDeck', 'Use standard (52 cards) deck (active from next shuffle on).')
      .addField('!useStrippedDeck', 'Use stripped (32 cards) deck (active from next shuffle on).')
      .addField('!useJoker', 'Add joker to the decks (active from next shuffle on).')
      .addField('!dontUseJoker', 'Don\'t add joker to the decks (active from next shuffle on).')
      .addField('!printMinimized', 'Print the answer from draw minimized.')
      .addField('!printMaximized', 'Print the answer from draw maximized.')
      .addField('!setPrefix [?newPrefix]', 'Set the prefix from `!` to another. If no parameter is set, it changes back to `!`')
      .addField('!help', 'Get this help information')
      .addField('Default', 'By default it uses a standard deck (52 cards) without joker and print it minimized. The default prefix is `!`');
    this.sendAnswer();
  }
}
