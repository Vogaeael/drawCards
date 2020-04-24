export const TYPES = {
  Bot: Symbol("Bot"),
  Client: Symbol("Client"),
  Token: Symbol("Token"),
  CommandHandler: Symbol("CommandHandler"),
  CommandDeterminer: Symbol("CommandDeterminer"),
  Guild: Symbol("Guild"),
  GuildFactory: Symbol("Factory<IGuild>"),
  GuildConfig: Symbol("GuildConfig"),
  GuildConfigFactory: Symbol("Factory<IGuildConfig>"),
  Deck: Symbol("Deck"),
  DeckFactory: Symbol("DeckFactory"),
  Card: Symbol("Card"),
  CardFactory: Symbol("Factory<Card>"),
  Message: Symbol("Message"),
  MessageFactory: Symbol("MessageFactory"),
  // Commands
  Shuffle: Symbol("ShuffleCommand"),
  Draw: Symbol("DrawCommand"),
  UseStandardDeck: Symbol("UseStandardDeckCommand"),
  UseStrippedDeck: Symbol("UseStrippedDeckCommand"),
  UseJoker: Symbol("UseJokerCommand"),
  DontUseJoker: Symbol("DontUseJokerCommand"),
  PrintMinimized: Symbol("PrintMinimizedCommand"),
  PrintMaximized: Symbol("PrintMaximizedCommand"),
  SetPrefix: Symbol("SetPrefixCommand"),
  Help: Symbol("HelpCommand")
};
