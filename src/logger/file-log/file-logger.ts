import { AbstractLogger, Loglevel } from '../logger-interface';
import * as FS from 'fs';

export class FileLogger extends AbstractLogger {
  private static dir: string = './logs/';
  private static file: string = 'sys.logs';
  private static encoding: string = 'utf8';

  /**
   * @inheritDoc
   */
  protected _log(level: Loglevel, message: string): void {
    const msg: string = level.toString().toUpperCase() + ': ' + message + '\n';
    FileLogger.createDirIfNotExist();
    FS.promises.appendFile(
      FileLogger.dir + FileLogger.file,
      msg,
      { encoding: FileLogger.encoding }
    ).catch((e) => {
      console.log(e);
    });
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
