import { inject, injectable } from 'inversify';
import { IGuild } from '../guild/guild';
import { Message, MessageEmbed } from 'discord.js';
import { ICommandDeterminer } from './command-determiner';
import { TYPES } from '../types';
import { ICommand } from './commands/command';

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
  ): void
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
    // inject Commands
    @inject(TYPES.Shuffle) shuffle: ICommand,
    @inject(TYPES.Draw) draw: ICommand,
    @inject(TYPES.UseStandardDeck) useStandardDeck: ICommand,
    @inject(TYPES.UseStandardDeck) useStrippedDeck: ICommand,
    @inject(TYPES.UseJoker) useJoker: ICommand,
    @inject(TYPES.DontUseJoker) dontUseJoker: ICommand,
    @inject(TYPES.PrintMinimized) printMinimized: ICommand,
    @inject(TYPES.PrintMaximized) printMaximized: ICommand,
    @inject(TYPES.SetPrefix) setPrefix: ICommand,
    @inject(TYPES.Help) help: ICommand
  ) {
    this.cmdDeterminer = cmdDeterminer
    this.msgFactory = msgFactory;
    this.initCommands(
      draw,
      shuffle,
      useStandardDeck,
      useStrippedDeck,
      useJoker,
      dontUseJoker,
      printMinimized,
      printMaximized,
      setPrefix,
      help
    );
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
   *
   * @param draw: ICommand
   * @param shuffle: ICommand
   * @param useStandardDeck: ICommand
   * @param useStrippedDeck: ICommand
   * @param useJoker: ICommand
   * @param dontUseJoker: ICommand
   * @param printMinimized: ICommand
   * @param printMaximized: ICommand
   * @param setPrefix: ICommand
   * @param help: ICommand
   */
  private initCommands(
    draw: ICommand,
    shuffle: ICommand,
    useStandardDeck: ICommand,
    useStrippedDeck: ICommand,
    useJoker: ICommand,
    dontUseJoker: ICommand,
    printMinimized: ICommand,
    printMaximized: ICommand,
    setPrefix: ICommand,
    help: ICommand
  ): void {
    this.commands = new Map<string, ICommand>();
    this.commands.set('draw', draw);
    this.commands.set('shuffle', shuffle);
    this.commands.set('useStandardDeck', useStandardDeck);
    this.commands.set('useStrippedDeck', useStrippedDeck);
    this.commands.set('useJoker', useJoker);
    this.commands.set('dontUseJoker', dontUseJoker);
    this.commands.set('printMinimized', printMinimized);
    this.commands.set('printMaximized', printMaximized);
    this.commands.set('setPrefix', setPrefix);
    this.commands.set('help', help);
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
