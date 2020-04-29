import { ICard } from '../deck/card';
import { promises as FS, Stats } from 'fs';
import { ILogger, Loglevel } from '../logger/logger-interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { from, ReplaySubject } from 'rxjs';
import { ReplaySubjectFactory } from '../inversify.config';

export interface IDesignHandler {
  /**
   * Get the list of possible designs
   *
   * @return string[]
   */
  getDesignList(): string[];

  /**
   * Get the path to a card picture, use fallback if the other of the design doesn't exist
   *
   * @param design: string
   * @param card: ICard
   *
   * @return string
   */
  getCardPath(design: string, card: ICard): ReplaySubject<string>;
}

@injectable()
export class DesignHandler implements IDesignHandler {
  private readonly logger: ILogger;
  private readonly replaySubjectFactory: ReplaySubjectFactory;
  private possibleDesigns: string[];
  private readonly path: string = './media/images/designs/'
  private readonly fallback: string = 'acbl';

  constructor(
    @inject(TYPES.Logger) logger: ILogger,
    @inject(TYPES.ReplaySubjectFactory) replaySubjectFactory: ReplaySubjectFactory
  ) {
    this.logger = logger;
    this.replaySubjectFactory = replaySubjectFactory;
    this.loadDesigns();
  }

  /**
   * @inheritDoc
   */
  public getDesignList(): string[] {
    return this.possibleDesigns;
  }

  /**
   * @inheritDoc
   */
  public getCardPath(design: string, card: ICard): ReplaySubject<string> {
    const pathSubject: ReplaySubject<string> = this.replaySubjectFactory<string>();
    this.hasPicture(design, card)
      .subscribe(
        (path: string) => {
          pathSubject.next(path);
          pathSubject.complete();
        },
        (e: string) => {
          this.logger.log(Loglevel.DEBUG,
            'Missing card ' +
            card.getSuit() +
            ' ' +
            card.getRank() +
            ' from design ' +
            design +
            ': ' +
            e);
          this.hasPicture(this.fallback, card).subscribe(
            (path: string) => {
              pathSubject.next(path);
              pathSubject.complete();
            },
            (e) => {
              this.logger.log(Loglevel.ERROR, 'Fallback card ' +
                card.getSuit() +
                ' ' +
                card.getRank() +
                ' not found: ' +
                e);
            }
          )
        }
      );

    return pathSubject;
  }

  /**
   * Search for directories bellow the path and add them to the possible design list.
   */
  private loadDesigns(): void {
    this.possibleDesigns = []
    FS.readdir(this.path)
      .then((dirs: string[]) => {
        dirs.forEach((dir: string) => {
          FS.lstat(this.path + dir)
            .then((stats: Stats) => {
              if (stats.isDirectory()) {
                this.logger.log(Loglevel.DEBUG, 'Found design \'' + dir + '\'');
                this.possibleDesigns.push(dir);
              }
            })
            .catch((e) => this.logger.log(Loglevel.ERROR, 'Can\'t load stats of \'' + dir + '\': ' + e));
        });
      })
      .catch((e) => this.logger.log(Loglevel.FATAL, 'Can\'t load designs: ' + e));
  }

  /**
   * Check if the card file for the design exists. Next will be the path, if it exists, or an error if not.
   *
   * @param design: string
   * @param card: ICard
   *
   * @return ReplaySubject<string>
   */
  private hasPicture(design: string, card: ICard): ReplaySubject<string> {
    const hasPictureSubject: ReplaySubject<string> = this.replaySubjectFactory<string>();
    let path: string = this.path + design + '/' + card.getRank() + '_' + card.getSuit() + '.png';
    from(FS.lstat(path))
      .subscribe(
        (stats: Stats) => {
          if (stats.isFile()) {
            hasPictureSubject.next(path);
            hasPictureSubject.complete();

            return
          }
          hasPictureSubject.error('is not a file');
        },
        () => {
          hasPictureSubject.error('File doesn\'t exist');
        });
    return hasPictureSubject;
  }
}
