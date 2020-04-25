import "reflect-metadata";
import 'mocha';
import { expect } from 'chai';
import { Client, Message } from 'discord.js';
import { instance, mock } from 'ts-mockito';
import { CommandHandler } from './command-handler';
import { CommandDeterminer, ICommandDeterminer } from './command-determiner';
import { MessageFactory } from './commands/command';
import { Guild, IGuild } from '../guild/guild';
import { Draw } from './commands/draw';

describe('CommandHandler', () => {
  let mockedCmdDeterminerClass: ICommandDeterminer;
  let mockedCmdDeterminerInstance: ICommandDeterminer;
  let mockedMessageFactoryClass: MessageFactory;
  let mockedMessageFactoryInstance: MessageFactory;
  let mockedMessageClass: Message;
  let mockedMessageInstance: Message;
  let mockedGuildClass: IGuild;
  let mockedGuildInstance: IGuild;

  let cmdHandler: CommandHandler;

  beforeEach(() => {
    mockedCmdDeterminerClass = mock<ICommandDeterminer>(CommandDeterminer);
    mockedCmdDeterminerInstance = instance<ICommandDeterminer>(mockedCmdDeterminerClass);
    mockedMessageFactoryClass = mock<MessageFactory>(() => { });
    mockedMessageFactoryInstance = instance<MessageFactory>(mockedMessageFactoryClass);
    mockedMessageClass = mock<Message>(Message);
    mockedMessageInstance = instance<Message>(mockedMessageClass);
    mockedGuildClass = mock<IGuild>(Guild);
    mockedGuildInstance = instance<IGuild>(mockedGuildClass);

    cmdHandler = new CommandHandler(
      mockedCmdDeterminerInstance,
      mockedMessageFactoryInstance
    );
  });

  it('should handle the message',async () => {
    await cmdHandler.handle(mockedMessageInstance, mockedGuildInstance);

    await service.listen()
    await service.handle(mockedMessageInstance).then(() => {
      // Successful promise is unexpected, so we fail the test
      expect.fail('Unexpected promise');
    }).catch(() => {
      // Rejected promise is expected, so nothing happens here
    });

    verify(mockedMessageClass.reply('pong!')).never();
  });

  it('should not listen', async () => {

  });

  function addCommands() {
    cmdHandler.addCommands([
      
    ]);
  }
})
