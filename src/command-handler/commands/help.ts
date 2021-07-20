import { Command, ICommand } from './command';
import { AnswerColor } from '../answer-color';

/**
 * Command !help
 * Print the help information
 */
export class Help extends Command {
  /**
   * @inheritDoc
   */
  public name: string[] = [ 'help' ];

  /**
   * Command !help
   * Print the help information
   *
   * @inheritDoc
   */
  public run(commandName: string, params: string): void {
    this.logCommand('help', commandName, params);
    const command: ICommand = this.cmdList.getCommand(params);
    if (command) {
      command.init(this.curGuild, this.msg);
      command.help();

      return;
    }

    this.help();
  }

  /**
   * @inheritDoc
   */
  public help(): void {
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
      .addField('!shuffle [?num]', 'Shuffle the hole deck new. For more information use `!help shuffle`.')
      .addField('!draw [?num]', 'Draw cards of the deck. For more information use `!help draw`.')
      .addField('!cardsLeft', 'Message how many cards are left in the deck. For more information use `!help cardsLeft`.')
      .addField('!useStandardDeck', 'Use standard (52 cards) deck. For more information use `!help useStandardDeck`.')
      .addField('!useStrippedDeck', 'Use stripped (32 cards) deck. For more information use `!help useStrippedDeck`.')
      .addField('!useJoker', 'Add joker to the decks. For more information use `!help useJoker`.')
      .addField('!dontUseJoker', 'Don\'t add joker to the decks. For more information use `!help dontUseJoker`.')
      .addField('!printMinimized', 'Print all answers so short as possible. For more information use `!help printMinimized`.')
      .addField('!printMaximized', 'Print all answers not anymore so short as possible. For more information use `!help printMaximized`.')
      .addField('!listDesigns', 'List all possible designs. For more information use `!help listDesigns`.')
      .addField('!setDesign [?design]', 'Set the cards design. For more information use `!help setDesign`.')
      .addField('!setPrefix [?newPrefix]', 'Set the prefix from `!` to another. For more information use `!help setPrefix`.')
      .addField('!help [?command]', 'Get the help information.' +
        ' If you set the name of a command instead of `[?command]` you get the special help for this command.' +
        ' If you dont set something for `[?command]` the normal help will be answered.')
      .addField('Default', 'By default it uses a standard deck (52 cards) without joker and print it minimized.' +
        ' The default prefix is `!`');
    this.sendAnswer();
  }
}
