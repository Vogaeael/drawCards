import { Command, ICommand, MessageFactory } from './command';
import { ILogger, Loglevel } from '../../logger/logger-interface';
import { IDatabaseApi } from '../../database/database-api';
import { ICard } from '../../deck/card';
import { Message, Snowflake } from 'discord.js';
import { Suits } from '../../deck/suits';
import { StandardDeck } from '../../deck/deck-types';
import { randomFromArray } from '../../functions';
import container, { MapFactory } from '../../inversify.config';
import { TYPES } from '../../types';
import { ICommandList } from '../command-list';
import { from } from 'rxjs';
import { IDesignHandler } from '../../design/designHandler';

interface CardTrick {
  userId: Snowflake;
  cardShowMessage: Message;
  showedCard: ICard;
  lastCommand: string;
}

type SubCommand = () => void;

export class Konami extends Command {
  private static konamiCode: string = "⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️🅱️🅰️";
  private static pullCard: string = 'pullCard';
  private static pushCard: string = 'pushCard';

  /**
   * @inheritDoc
   */
  public name: string[] = ["⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️🅱️🅰️"];
  private subCommands: Map<string, SubCommand>;
  private userSubGames: Map<Snowflake, CardTrick>;
  private curCommandName: string;
  private curParams: string;
  private curUserSubGame: CardTrick;

  constructor(
    msgFactory: MessageFactory,
    databaseApi: IDatabaseApi,
    logger: ILogger,
    cmdList: ICommandList,
    designHandler: IDesignHandler,
    mapFactory: MapFactory
  ) {
    super(msgFactory,
      databaseApi,
      logger,
      cmdList,
      designHandler,
      mapFactory);
    this.initSubCommands();
    this.userSubGames = this.mapFactory<Snowflake, CardTrick>();
    this.name = Array.from(this.subCommands.keys());
  }

  /**
   * Command !
   *
   * @inheritDoc
   */
  public run(commandName: string, params: string): void {
    this.curCommandName = commandName;
    this.curParams = params;
    this.logCommand('konami', commandName, params);
    const subCommand: SubCommand = this.subCommands.get(commandName);
    if (!subCommand) {
      this.logger.log(Loglevel.FATAL, 'SubCommand \'' + commandName + '\' not found');

      return
    }
    this.curUserSubGame = this.userSubGames.get(this.msg.author.id);
    subCommand();
  }

  /**
   * @inheritDoc
   */
  public help(): void {
    const help: ICommand = this.cmdList.getCommand('help');
    if (help) {
      help.help();
    }
    this.logger.log(Loglevel.ERROR, 'Dont find command \'help\'');
    // No help for this easter egg
  }

  /**
   * Initialize the subCommands
   */
  private initSubCommands(): void {
    this.subCommands = this.mapFactory<string, SubCommand>();
    this.subCommands.set(Konami.konamiCode, () => this.konami());
    this.subCommands.set(Konami.pullCard, () => this.pullCard());
    this.subCommands.set(Konami.pushCard, () => this.pushCard());
  }

  /**
   * Start konami code
   *
   */
  private konami(): void {
    this.msg.reply('Okay, I show you a trick 😉, pull a card (command: ' + Konami.pullCard + ')')
      .catch((e) => this.logger.log(Loglevel.ERROR, e));
    from(this.msg.delete())
      .subscribe(
        () => this.logger.log(Loglevel.DEBUG, 'Konami message deleted'),
        (e) => this.logger.log(Loglevel.ERROR, 'Couldn\'t delete Konami message: ' + e)
      )
    if (!this.curUserSubGame) {
      this.curUserSubGame = {
        userId: this.msg.author.id,
        cardShowMessage: undefined,
        showedCard: Konami.getRandomCard(),
        lastCommand: this.curCommandName
      }
      this.logger.log(
        Loglevel.DEBUG,
        'UserSubGame initialized with the values: userID: \'' +
        this.curUserSubGame.userId +
        '\' cardShowMessage: \'' +
        this.curUserSubGame.cardShowMessage +
        '\' card: (suit: \'' +
        this.curUserSubGame.showedCard.getSuit() +
        '\' rank: \'' +
        this.curUserSubGame.showedCard.getRank() +
        '\') lastCommand: \'' +
        this.curUserSubGame.lastCommand +
        '\'');
    }
    this.curUserSubGame.lastCommand = Konami.konamiCode;
    this.userSubGames.set(this.curUserSubGame.userId, this.curUserSubGame);
  }

  /**
   * Pull a card to remember
   */
  private pullCard(): void {
    if (!this.curUserSubGame || this.curUserSubGame.lastCommand !== Konami.konamiCode) {
      return
    }
    this.initAnswer();
    this.answer.setDescription(
      this.getMentionOfAuthor() +
      ', You got the card :' +
      this.curUserSubGame.showedCard.getSuit() +
      ': ' + this.curUserSubGame.showedCard.getRank() +
      '. Remember it an push it back in the deck (command: ' +
      Konami.pushCard + ')');
    this.addCardImage(this.curUserSubGame.showedCard);
    this.sendAnswer((message: Message) => this.curUserSubGame.cardShowMessage = message);
    this.curUserSubGame.lastCommand = Konami.pullCard;
  }

  /**
   * Push card back and shuffle to present hopefully the same card again
   */
  private pushCard(): void {
    if (!this.curUserSubGame || this.curUserSubGame.lastCommand !== Konami.pullCard) {
      return
    }
    this.msg.reply('Thank you for the card. Now I will shuffle the deck...')
      .catch((e) => this.logger.log(Loglevel.ERROR, 'cant reply message: ' + e));
    from(this.curUserSubGame.cardShowMessage.delete())
      .subscribe(
        () => this.logger.log(Loglevel.DEBUG, 'Delete showMessage'),
        (e) => this.logger.log(Loglevel.ERROR, 'Couldn\'t delete showMessage: ' + e));
    setTimeout(() => {
      const rightCard = Konami.getRandomBoolean(80);
      const card: ICard = Konami.getMagicCard(this.curUserSubGame, rightCard);
      this.initAnswer();
      this.answer.setDescription(this.getMentionOfAuthor() + ', was that your card?');
      this.addCardImage(card);
      this.sendAnswer(() => {
        if (!rightCard) {
          setTimeout(() => {
            this.initAnswer();
            this.answer.setDescription(this.getMentionOfAuthor() + ', Ohh, sorry I made a mistake .-.');
            this.sendAnswer();
          }, 3000);
        }
      });

      this.userSubGames.delete(this.curUserSubGame.userId);
    }, 6000);
  }

  /**
   * Get a random Card from a standard deck without joker
   *
   * @return ICard
   */
  private static getRandomCard(): ICard {
    const suits: string[] = Array.from(Object.keys(Suits).filter((suit: string) => Suits[suit] !== Suits.joker));
    const ranks: string[] = Array.from(Object.values(StandardDeck));

    const suit = randomFromArray(suits);
    const rank = randomFromArray(ranks);

    const card: ICard = container.get<() => ICard>(TYPES.CardFactory)(); //@TODO get random card
    card.init(suit, rank);

    return card;
  }

  /**
   * Get a random bool with a special percent change to get true
   *
   * @param percentToGetTrue: number percent change to get true
   *
   * @return boolean, random boolean
   */
  private static getRandomBoolean(percentToGetTrue: number): boolean {
    return percentToGetTrue > (Math.random() * 100);
  }

  /**
   * Get the drawn card of the user, or eventually another
   *
   * @param userSubGame: CardTrick
   * @param rightCard: boolean, if it should be the right card
   *
   * @return ICard
   */
  private static getMagicCard(userSubGame: CardTrick, rightCard: boolean): ICard {
    let card = userSubGame.showedCard;
    if (!rightCard) {
      let newCard: ICard = Konami.getRandomCard();
      while (newCard.getSuit() === card.getSuit() && newCard.getRank() === card.getRank()) {
        newCard = Konami.getRandomCard();
      }
      card = newCard;
    }

    return card;
  }
}
