import { inject, injectable } from 'inversify';
import { TYPES } from '../types';

export enum Loglevel {
  INFO = 'info',
  FATAL = 'fatal',
  ERROR = 'error',
  DEPRECATED = 'deprecated',
  DEBUG = 'debug',
}

export interface ILogger {
  /**
   * Log a error message
   *
   * @param level: Loglevel
   * @param message: string, the error message to log
   */
  log(level: Loglevel, message: string): void,

  /**
   * Set from which level on it should log
   *
   * @param level: Loglevel
   */
  setPrintLevel(level: Loglevel): void
}

@injectable()
export abstract class AbstractLogger implements ILogger {
  protected printLevel: number;
  protected logLevelList: Map<string, number>;

  constructor(
    @inject(TYPES.LogLevel) logLevel: string
  ) {
    this.initLogLevelList();
    this.printLevel = this.logLevelList.get(logLevel);
    if (undefined === this.printLevel) {
      this.printLevel = this.logLevelList.get(Loglevel.ERROR);
      this.log(Loglevel.FATAL, 'loglevel \'' + logLevel + '\' doesn\'t exist. Will use \'' + Loglevel.ERROR + '\'');
    }
  }

  /**
   * @inheritDoc
   */
  public log(level: Loglevel, message: string): void {
    if (this.logLevelList.get(level) <= this.printLevel) {
      this._log(level, message);
    }
  }

  /**
   * @inheritDoc
   */
  public setPrintLevel(level: Loglevel): void {
    this.printLevel = this.logLevelList.get(level);
  }

  /**
   * log the message
   *
   * @param level: Loglevel
   * @param message: string
   */
  protected abstract _log(level: Loglevel, message: string): void;

  /**
   * Initialize the log level list with:
   * - Info
   * - Fatal
   * - Error
   * - Deprecated
   * - Debug
   */
  private initLogLevelList(): void {
    this.logLevelList = new Map<string, number>();
    this.logLevelList.set(Loglevel.INFO, 0);
    this.logLevelList.set(Loglevel.FATAL, 1);
    this.logLevelList.set(Loglevel.ERROR, 2);
    this.logLevelList.set(Loglevel.DEPRECATED, 3);
    this.logLevelList.set(Loglevel.DEBUG, 4);
  }
}
