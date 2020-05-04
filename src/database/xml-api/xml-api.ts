import { AbstractDatabaseApi } from '../database-api';
import { Snowflake } from 'discord.js';
import { IGuildConfig } from '../../guild/guild-config';
import { promises as FS } from 'fs';
import * as PARSER from 'xml2json';
import { Loglevel } from '../../logger/logger-interface';
import { from, Observable, ReplaySubject } from 'rxjs';

export class XmlApi extends AbstractDatabaseApi {
  private static path: string = './saves/';
  private static prefix: string = 'save';
  private static encoding: string = 'utf8';

  /**
   * @inheritDoc
   */
  public loadGuildConfig(guildId: Snowflake): ReplaySubject<IGuildConfig> {
    this.logger.log(Loglevel.DEBUG, 'load config of guild \'' + guildId + '\'');

    const guildConfigSubject: ReplaySubject<IGuildConfig> = this.replaySubjectFactory<IGuildConfig>();

    from(FS.readFile(
      XmlApi.path + XmlApi.prefix + guildId + '.xml',
      {encoding: XmlApi.encoding}))
      .subscribe(
        (data: string | Buffer) => {
          const guildConfig = this.guildConfigFactory();
          const json = JSON.parse(PARSER.toJson(data, {reversible: true}));
          const guildConfigJson = json["guildConfig"];
          guildConfig.setPrefix(guildConfigJson['prefix']);
          guildConfig.setDeckType(guildConfigJson['deckType']);
          guildConfig.setJoker(JSON.parse(guildConfigJson['joker']));
          guildConfig.setMinimized(JSON.parse(guildConfigJson['minimized']));

          guildConfigSubject.next(guildConfig);
          guildConfigSubject.complete();
        },
        (e) => {
          this.logger.log(Loglevel.ERROR, 'couldn\'t load file for guild \'' + guildId + '\': ' + e);

          guildConfigSubject.next(this.guildConfigFactory());
          guildConfigSubject.complete();
        }
      );

    return guildConfigSubject;
  }

  /**
   * @inheritDoc
   */
  public saveGuildConfig(guildId: Snowflake, guildConfig: IGuildConfig): Observable<void> {
    this.logger.log(Loglevel.DEBUG, 'save config of guild \'' + guildId + '\'');

    const guildConfigJson = {
      'guildConfig': {
        'prefix': guildConfig.getPrefix(),
        'deckType': guildConfig.getDeckType(),
        'joker': guildConfig.getJoker(),
        'minimized': guildConfig.getMinimized()
      }
    };

    let xml = PARSER.toXml(JSON.stringify(guildConfigJson));

    return from(FS.writeFile(
      XmlApi.path + XmlApi.prefix + guildId + '.xml',
      xml,
      { encoding: XmlApi.encoding })
      .catch((e) => {
        this.logger.log(Loglevel.FATAL, 'couldn\'t save config of guild \'' + guildId + '\': ' + e);
      }));
  }
}
