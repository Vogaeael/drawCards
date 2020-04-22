export enum DeckTypes {
  strippedDeck = 'stripped deck',
  standardDeck = 'standard deck',
}

export const StrippedDeck = [
  'ace',
  '7',
  '8',
  '9',
  '10',
  'jack',
  'queen',
  'king'
];

export const StandardDeck = StrippedDeck.concat([
  '2',
  '3',
  '4',
  '5',
  '6',
]);

export enum Joker {
  black_joker = 'black_joker',
  black_joker2 = 'black_joker'
}
