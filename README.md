# drawCards
A bot for drawing random cards out of a deck. Standard (52 Cards) or stripped (32 Cards) decks are possible. You can decide if it should shuffle joker in the deck or not. The command-prefix ("!") is changeable. You can draw one or multiple cards. For more information visit Github: https://github.com/Vogaeael/drawCards.

## install
### install dependencies
To develop you need npm. Run `npm install` to install the dependencies.

### create .env
You need a `.env` file, as template you can use the `.env.dist`.

## Compile to .js files
### one time
To compile the `.ts` files to `.js` files one time use:
`yarn compile`

### start compile watcher
To start a watcher which compile by changes use:
`yarn watch`

## run tests
For running tests (at the moment there aren't any):
`yarn test`

## start bot
To start the bot use:
`npm start`

## Commands

### shuffle
To shuffle the deck:
`!shuffle`

### draw
To draw one or multiple cards.
```shell script
!draw       # for drawing one card
!draw 12    # for drawing twelve cards
!draw lll   # would draw one card because one is default
```

### use standard deck
If you want to change back to the standard deck (52 cards):
`!useStandardDeck`

### use stripped deck
If you want to change to as stripped deck (32 cards):
`!useStrippedDeck`

### use joker
If you want that jokers are also in the deck:
`!useJoker`

### don't use joker
If you want that jokers aren't in the deck:
`!dontUseJoker`

### set prefix
If you want to change the prefix from "!" to something else.
```shell script
!setPrefix bob  # change the prefix to bob => "bobdraw" would be the new "draw"
!setPrefix      # without parameter it changes back to "!"
```

### help
If you want to see the help:
`!help`
