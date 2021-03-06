import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { MapFactory } from '../inversify.config';

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
    @inject(TYPES.LogLevel) logLevel: string,
    @inject(TYPES.MapFactory) mapFactory: MapFactory
  ) {
    this.initLogLevelList(mapFactory);
    this.printLevel = this.logLevelList.get(logLevel);
    if (undefined === this.printLevel) {
      this.printLevel = this.logLevelList.get(Loglevel.ERROR);
      this.log(Loglevel.FATAL, 'loglevel \'' + logLevel + '\' doesn\'t exist. Will use \'' + Loglevel.ERROR + '\'');
    }
    this.log(Loglevel.DEBUG, 'Constructed logger');
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
   *
   * @param mapFactory: MapFactory
   */
  private initLogLevelList(mapFactory: MapFactory): void {
    this.logLevelList = mapFactory<string, number>();
    this.logLevelList.set(Loglevel.INFO, 0);
    this.logLevelList.set(Loglevel.FATAL, 1);
    this.logLevelList.set(Loglevel.ERROR, 2);
    this.logLevelList.set(Loglevel.DEPRECATED, 3);
    this.logLevelList.set(Loglevel.DEBUG, 4);
  }

  /**
   * Create the log message
   *
   * @param level: Loglevel
   * @param message: string
   */
  protected createLogMessage(level: Loglevel, message: string): string {
    const now: number = Date.now();
    const dtf = new Intl.DateTimeFormat('en',
      {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    const [{ value: mo },,{ value: da },,{ value: ye },,{ value: hour },,{ value: min },,{ value:sec }] = dtf.formatToParts(now)

    return '[' + ye + '-' + mo + '-' + da + 'T' + hour + ':' + min + ':' + sec + ']' +
      '[' + level.toString().toUpperCase() + ']: ' +
      message;
  }
}
