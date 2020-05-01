import { CommandFactory, ICommand, ICommandClass } from './commands/command';
import { ILogger, Loglevel } from '../logger/logger-interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';

export interface ICommandList {
  /**
   * Get a command by name
   *
   * @param name: string
   *
   * @return ICommand | undefined
   */
  getCommand(name: string): ICommand | undefined,

  /**
   * Get the name of the commands
   *
   * @return IterableIterator<string>
   */
  getNames(): IterableIterator<string>,

  /**
   * Add a list of commands
   *
   * @param commands: ICommandClass[]
   */
  addCommands(commands): void,

  /**
   * Add a command
   * @param className: ICommandClass
   */
  addCommand(className: ICommandClass): void
}

@injectable()
export class CommandList implements ICommandList{
  private readonly logger: ILogger;
  private readonly cmdFactory: CommandFactory;
  private commands: Map<string, ICommand>;

  constructor(
    @inject(TYPES.Logger) logger: ILogger,
    @inject(TYPES.CommandFactory) cmdFactory: CommandFactory
  ) {
    this.logger = logger;
    this.cmdFactory = cmdFactory;
    this.commands = new Map<string, ICommand>();
  }

  /**
   * @inheritDoc
   */
  public getCommand(name: string): ICommand | undefined {
    return this.commands.get(name);
  }

  /**
   * @inheritDoc
   */
  public getNames(): IterableIterator<string> {
    return this.commands.keys();
  }

  /**
   * @inheritDoc
   */
  public addCommands(commands): void {
    commands.forEach((className: ICommandClass) => {
      this.addCommand(className);
    })
  }

  /**
   * @inheritDoc
   */
  public addCommand(className: ICommandClass): void {
    try {
      const command: ICommand | undefined = this.cmdFactory(className, this);
      if (command) {
        this.logger.log(Loglevel.DEBUG, 'add command: ' + command.name);
        command.name.forEach((name: string) => {
          this.commands.set(name, command);
        });

        return
      }
      this.logger.log(Loglevel.FATAL, 'couldn\'t init command: command is undefined');
    } catch (e) {
      this.logger.log(Loglevel.FATAL, 'couldn\'t init command: ' + e);
    }
  }
}
