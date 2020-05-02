import { AbstractLogger, Loglevel } from '../logger-interface';
import * as FS from 'fs';

export class FileLogger extends AbstractLogger {
  private static dir: string = './log/';
  private static file: string = 'sys.log';
  private static encoding: string = 'utf8';

  /**
   * @inheritDoc
   */
  protected _log(level: Loglevel, message: string): void {
    FileLogger.createDirIfNotExist();
    FS.promises.appendFile(
      FileLogger.dir + FileLogger.file,
      this.createLogMessage(level, message + '\n'),
      {encoding: FileLogger.encoding}
    ).catch((e) => console.log(e));
  }

  /**
   * Create the dir if it doesn't exist
   */
  private static createDirIfNotExist(): void {
    if (!FS.existsSync(FileLogger.dir)) {
      FS.mkdirSync(FileLogger.dir);
    }
  }
}
