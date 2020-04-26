import { AbstractDatabaseApi } from '../database-api';
import { Snowflake } from 'discord.js';
import { IGuildConfig } from '../../guild/guild-config';
import { promises as FS } from 'fs';
import * as PARSER from 'xml2json';
import { Loglevel } from '../../logger/logger-interface';

export class XmlApi extends AbstractDatabaseApi {
  private static path: string = './saves/';
  private static prefix: string = 'save';
  private static encoding: string = 'utf8';

  /**
   * @inheritDoc
   */
  public async loadGuildConfig(guildId: Snowflake): Promise<IGuildConfig> {
    this.logger.log(Loglevel.DEBUG, 'load config of guild \'' + guildId + '\'');
    this.initGuildConfig();

    return FS.readFile(
        XmlApi.path + XmlApi.prefix + guildId + '.xml',
        { encoding: XmlApi.encoding })
      .then((data: string | Buffer) => {
        const json = JSON.parse(PARSER.toJson(data, {reversible: true}));
        const guildConfig = json["guildConfig"];
        this.guildConfig.setPrefix(guildConfig['prefix']);
        this.guildConfig.setDeckType(guildConfig['deckType']);
        this.guildConfig.setJoker(JSON.parse(guildConfig['joker']));
        this.guildConfig.setMinimized(JSON.parse(guildConfig['minimized']));

        return this.guildConfig;
      })
      .catch(
        (e) => {
          // @TODO log error if not file not found error
          this.logger.log(Loglevel.ERROR, 'couldn\'t load file for guild \'' + guildId + '\': ' + e);
          return this.guildConfig;
        }
      );
  }

  /**
   * @inheritDoc
   */
  public saveGuildConfig(guildId: Snowflake, guildConfig: IGuildConfig): boolean {
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

    FS.writeFile(
      XmlApi.path + XmlApi.prefix + guildId + '.xml',
      xml,
      { encoding: XmlApi.encoding})
      .catch((e) => {
        this.logger.log(Loglevel.FATAL, 'couldn\'t save config of guild \'' + guildId + '\': ' + e);
      });

    return true;
  }
}
