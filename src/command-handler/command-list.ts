import { ICommandClass, CommandFactory } from './commands/command';
import { ILogger, Loglevel } from '../logger/logger-interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { MapFactory } from '../inversify.config';

export interface ICommandList {
  /**
   * Get a command by name
   *
   * @param name: string
   *
   * @return ICommandClass | undefined
   */
  getCommand(name: string): ICommandClass | undefined,

  /**
   * Get the name of the commands
   *
   * @return IterableIterator<string>
   */
  getNames(): IterableIterator<string>,

  /**
   * Add a list of commands
   *
   * @param commands: ICommandClassList
   */

  addCommands(commands: ICommandClass[]): void,
  /**
   * Add a command
   * @param className: ICommandClass
   */
  addCommand(className: ICommandClass): void
}

@injectable()
export class CommandList implements ICommandList {
  private readonly logger: ILogger;
  private readonly cmdFactory: CommandFactory;
  private commands: Map<string, ICommandClass>;

  constructor(
    @inject(TYPES.Logger) logger: ILogger,
    @inject(TYPES.CommandFactory) cmdFactory: CommandFactory,
    @inject(TYPES.MapFactory) mapFactory: MapFactory
  ) {
    this.logger = logger;
    this.cmdFactory = cmdFactory;
    this.commands = mapFactory<string, ICommandClass>();
    this.logger.log(Loglevel.DEBUG, 'Constructed command-list');
  }

  /**
   * @inheritDoc
   */
  public getCommand(name: string): ICommandClass | undefined {
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
      this.logger.log(Loglevel.DEBUG, 'add command: ' + className.names);
      className.names.forEach((name: string) => {
        this.commands.set(name, className);
      });
    } catch (e) {
      this.logger.log(Loglevel.FATAL, 'couldn\'t init command: ' + e);
    }
  }
}
