import { Command } from './command';
import { Loglevel } from '../../logger/logger-interface';

export class SetDesign extends Command {
  /**
   * @inheritDoc
   */
  public readonly name: string[] = [ 'setDesign', 'setdesign' ];

  /**
   * @inheritDoc
   */
  public help(): void {
    this.sendShortHelp(
      'Help setDesign',
      'Command to set a card design. You can inform yourself which designs are possible with the command `listDesigns`.' +
      ' If you not add a param, the default design will be set. If the param is not a name of one of the list, it won\'t change.'
    )
  }

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
