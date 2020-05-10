import { Command } from './command';
import { AnswerColor } from '../answer-color';

export class ListDesigns extends Command {
  /**
   * @inheritDoc
   */
  public static readonly names: string[] = [ 'listDesigns' ];

  /**
   * @inheritDoc
   */
  public help(): void {
    this.sendShortHelp('List Designs', 'List all possible designs.');
  }

  /**
   * @inheritDoc
   */
  run(commandName: string, params: string): void {
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
}
