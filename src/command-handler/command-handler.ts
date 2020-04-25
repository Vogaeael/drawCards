import { inject, injectable } from 'inversify';
import { IGuild } from '../guild/guild';
import { Message, MessageEmbed } from 'discord.js';
import { ICommandDeterminer } from './command-determiner';
import { TYPES } from '../types';
import { ICommand, ICommandClass } from './commands/command';
import { lowerFirstChar } from '../functions';

export interface ICommandHandler {
  /**
   * Handle the message
   *
   * @param msg
   * @param curGuild
   */
  handle(
    msg: Message,
    curGuild: IGuild
  ): void,

  /**
   * Add commands to the command list
   *
   * @param classList
   */
  addCommands(classList): void,
}

@injectable()
export class CommandHandler implements ICommandHandler {
  private cmdDeterminer: ICommandDeterminer;
  private readonly msgFactory: () => MessageEmbed;
  private curGuild: IGuild;
  private curMessage: Message;
  private commands: Map<string, ICommand>;

  constructor(
    @inject(TYPES.CommandDeterminer) cmdDeterminer: ICommandDeterminer,
    @inject(TYPES.MessageFactory) msgFactory: () => MessageEmbed,//interfaces.Factory<Answer>,
  ) {
    this.cmdDeterminer = cmdDeterminer
    this.msgFactory = msgFactory;
    this.initCommands();
  }

  /**
   * @inheritDoc
   */
  public handle(msg: Message, curGuild: IGuild): void {
    this.curGuild = curGuild;
    this.curMessage = msg;

    this._handle();
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
    const command: ICommand = new className(this.msgFactory);
    const commandName: string = lowerFirstChar(className.name);
    this.commands.set(commandName, command);
  }

  /**
   * Init the commands:
   * - shuffle
   * - draw
   * - useStandardDeck
   * - useStrippedDeck
   * - useJoker
   * - dontUseJoker
   * - printMinimized
   * - printMaximized
   * - setPrefix
   * - help
   */
  private initCommands(): void {
    this.commands = new Map<string, ICommand>();
  }

  /**
   * Handle the message
   */
  private _handle(): void {
    const commandAndParams = this.cmdDeterminer.handle(
      this.commands,
      this.curMessage.content,
      this.curGuild.getConfig().getPrefix());

    if (commandAndParams) {
      const command: ICommand = commandAndParams[0];
      const params: string = commandAndParams[1];
      command.init(this.curGuild, this.curMessage);
      command.run(params);
    }
  }
}
