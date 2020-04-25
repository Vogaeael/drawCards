import "reflect-metadata";
import 'mocha';
import { expect } from 'chai';
import { Client } from 'discord.js';
import { instance, mock } from 'ts-mockito';
import { Bot } from './bot';
import { Guild, IGuild } from './guild/guild';
import { CommandHandler, ICommandHandler } from './command-handler/command-handler';

describe('Bot', () => {
  let mockedClientClass: Client;
  let mockedClientInstance: Client;
  let token: string;
  let mockedGuildFactoryClass: () => IGuild;
  let mockedGuildFactoryInstance: () => IGuild;
  let mockedCommandHandlerClass: ICommandHandler;
  let mockedCommandHandlerInstance: ICommandHandler;


  let service: Bot;

  beforeEach(() => {
    mockedClientClass = mock<Client>(Client);
    mockedClientInstance = instance<Client>(mockedClientClass);
    token = 'token';
    mockedGuildFactoryClass = mock(() => Guild);
    mockedGuildFactoryInstance = instance(mockedGuildFactoryClass);
    mockedCommandHandlerClass = mock(CommandHandler);
    mockedCommandHandlerInstance = instance(mockedCommandHandlerClass);

    service = new Bot(
      mockedClientInstance,
      token,
      mockedGuildFactoryInstance,
      mockedCommandHandlerInstance
    );
  });

  it('should listen',async () => {
    mockedClientInstance.
    whenIsPingThenReturn(false);

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
})
