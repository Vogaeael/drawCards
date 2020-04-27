import { AbstractLogger, Loglevel } from '../logger-interface';

export class ConsoleLogger extends AbstractLogger {
  /**
   * @inheritDoc
   */
  protected _log(level: Loglevel, message: string): void {
    console.log(this.createLogMessage(level, message));
  }
}
