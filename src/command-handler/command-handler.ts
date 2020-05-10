import { inject, injectable } from 'inversify';
import { CommandToHandle, ICommandDeterminer } from './command-determiner';
import { TYPES } from '../types';
import { ILogger, Loglevel } from '../logger/logger-interface';
import { CommandFactory, ICommand } from './commands/command';
import { ICommandList } from './command-list';

export interface ICommandHandler {
}

@injectable()
export class CommandHandler implements ICommandHandler {
  private readonly logger: ILogger;
  private readonly cmdFactory: CommandFactory;
  private readonly cmdList: ICommandList;

  constructor(
    @inject(TYPES.CommandDeterminer) cmdDeterminer: ICommandDeterminer,
    @inject(TYPES.CommandFactory) cmdFactory: CommandFactory,
    @inject(TYPES.CommandList) cmdList: ICommandList,
    @inject(TYPES.Logger) logger: ILogger
  ) {
    this.cmdFactory = cmdFactory;
    this.cmdList = cmdList;
    this.logger = logger;
    this.logger.log(Loglevel.DEBUG, 'Constructed command-handler');
    this.listenToHandle(cmdDeterminer);
  }

  /**
   * listen to new commands to handle by the command determiner
   *
   * @param cmdDeterminer: ICommandDeterminer
   */
  private listenToHandle(cmdDeterminer: ICommandDeterminer): void {
    cmdDeterminer.listenToCommandToHandle(
      (cmdToHandle: CommandToHandle) => {
        const cmd: ICommand = this.cmdFactory(cmdToHandle.command, this.cmdList);
        if (cmd) {
          cmd.init(cmdToHandle.guild, cmdToHandle.message);
          cmd.run(cmdToHandle.commandName, cmdToHandle.param);

          return
        }
        this.logger.log(Loglevel.FATAL, 'Command \'' + cmdToHandle.command + '\' not found.');
      },
      (e) => this.logger.log(Loglevel.FATAL, 'Error with command to handle: ' + e));
  }
}
