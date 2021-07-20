import { Command } from './command';
import { AnswerColor } from '../answer-color';

export class ListDesigns extends Command {
  /**
   * @inheritDoc
   */
  public name: string[] = [ 'listDesigns', 'listdesigns' ];

  /**
   * @inheritDoc
   */
  public run(commandName: string, params: string): void {
    this.initAnswer();
    this.answer.setTitle('List Designs');
    let description: string = '';
    this.designHandler.getDesignList().forEach((design: string) => {
      description += design + '\n';
    })
    this.answer.setDescription(description);
    this.answer.setColor(AnswerColor.info);
    this.sendAnswer();
  }

  /**
   * @inheritDoc
   */
  public help(): void {
    this.setAuthor('Help List Designs', 'list-designs');
    this.answer
      .setTitle('List Designs')
      .setColor(AnswerColor.info)
      .setDescription('List all possible designs with `listDesigns`.')
      .addField('Other Commands', 'You could also use `listdesigns`.');
    this.sendAnswer();
  }
}
