import { Command } from './command';
import { Loglevel } from '../../logger/logger-interface';
import { AnswerColor } from '../answer-color';

export class SetDesign extends Command {
  /**
   * @inheritDoc
   */
  public readonly name: string[] = [ 'setDesign', 'setdesign' ];

  /**
   * @inheritDoc
   */
  public run(commandName: string, params: string): void {
    if (!params) {
      this.setDesign(this.designHandler.getDefaultDesign());

      return
    }

    if (-1 !== this.designHandler.getDesignList().indexOf(params)) {
      this.setDesign(params);
    }
    // @TODO if one of the list, change it. if not we could eventually print the help, or the list.
  }

  /**
   * @inheritDoc
   */
  public help(): void {
    this.setAuthor('Help Set Design', 'set-design');
    this.answer
      .setTitle('Set Design')
      .setColor(AnswerColor.info)
      .setDescription('Set a card design with `setDesign [?name]`. You can inform yourself which designs are possible with the command `listDesigns`.')
      .addField('Param [?name]', 'To define which design you have to add the name. If you don\'t add a name, it will be set to default.')
      .addField('Other Commands', 'You could also use `setdesign`.')
      .addField('Examples', 'Here you can see some examples:\n' +
        '```\n' +
        'setDesign jack-mc-gee  # change to the design `jack-mc-gee`.\n' +
        'setdesign jack-mc-gee  # also change to the design `jack-mc-gee`.\n' +
        'setDesign eee          # does nothing because the design `eee` doesn\'t exist.\n' +
        'setDesign              # does set the design to default.\n' +
        '```');
    this.sendAnswer();
  }

  /**
   * Set the design and reply the answer.
   *
   * @param design: string
   */
  private setDesign(design: string): void {
    this.curGuild.getConfig().setDesign(design);
    this.logger.log(Loglevel.DEBUG, 'Set design in guild \'' + this.curGuild.getId() + '\' to \'' + design + '\'');
    this.replyConfigChange('Set Design', 'Set the design to ' + design);
  }
}
