import { AbstractLogger, Loglevel } from '../logger-interface';

export class ConsoleLogger extends AbstractLogger {
  /**
   * @inheritDoc
   */
  protected _log(level: Loglevel, message: string): void {
    const msg: string = level.toString().toUpperCase() + ': ' + message;
    console.log(msg);
  }
}
