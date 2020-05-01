import { inject, injectable } from 'inversify';
import { CommandToHandle, ICommandDeterminer } from './command-determiner';
import { TYPES } from '../types';
import { ILogger, Loglevel } from '../logger/logger-interface';

export interface ICommandHandler {
}

@injectable()
export class CommandHandler implements ICommandHandler {
  private readonly logger: ILogger;

  constructor(
    @inject(TYPES.CommandDeterminer) cmdDeterminer: ICommandDeterminer,
    @inject(TYPES.Logger) logger: ILogger
  ) {
    this.listenToHandle(cmdDeterminer);
    this.logger = logger;
  }

  /**
   * listen to new commands to handle by the command determiner
   *
   * @param cmdDeterminer: ICommandDeterminer
   */
  private listenToHandle(cmdDeterminer: ICommandDeterminer): void {
    cmdDeterminer.listenToCommandToHandle(
      (cmd: CommandToHandle) => {
        cmd.command.init(cmd.guild, cmd.message);
        cmd.command.run(cmd.param);
      },
      (e) => this.logger.log(Loglevel.FATAL, 'Error with command to handle: ' + e));
  }
}
