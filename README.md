# DrawCards
A bot for drawing random cards out of a deck. Standard (52 Cards) or stripped (32 Cards) decks are possible. You can decide if
 it should shuffle joker in the deck or not. The command-prefix `!` is changeable. You can draw one or multiple cards. For
 more information visit Github: https://github.com/Vogaeael/drawCards.
At the moment, the bot isn't published and there isn't a running server you can add to your discord server. To use this bot you
 have to host one yourself.
 
## Permissions
The Bots need the permission's to:
  * `read messages`
  * `write messages`
  * `embed links`
  * `attach files`

The permission's integer is `51200`. To add your bot to your server, you can use this link. You have to change the `[clientId]` to the client id of your bot:
`https://discordapp.com/api/oauth2/authorize?client_id=[clientId]`&permissions=51200&scope=bot`


## Install
### Install dependencies
To develop you need npm. To install the dependencies:
```shell script
npm install
```

### Create .env
You need a `.env` file, as template you can use the [.env.dist](.env.dist). Here you need to set a bot-token.

#### Generate bot token
To generate your own bot-token use this [Tutorial](https://www.writebots.com/discord-bot-token/).

## Compile to .js files
### One time
To compile the `.ts` files to `.js` files one time use:
```shell script
yarn compile
````

### Start compile watcher
To start a watcher which compile by changes use:
```shell script
yarn watch
```

## Run tests
For running tests (at the moment there aren't any):
```shell script
yarn test
```

## Start bot
To start the bot use:
```shell script
npm start
```

## Commands

### Shuffle
To shuffle the deck:
`!shuffle`

### Draw
To draw one or multiple cards.
```shell script
!draw       # for drawing one card
!draw 12    # for drawing twelve cards
!draw eee   # would draw one card because one is default
!draw all   # for drawing all remaining cards
```

### How many cards are remaining in the deck
To know how many cards are remaining in the deck:
`!cardsLeft`

### Use standard deck
If you want to change back to the standard deck (52 cards):
`!useStandardDeck`

### Use stripped deck
If you want to change to as stripped deck (32 cards):
`!useStrippedDeck`

### Use joker
If you want that jokers are also in the deck:
`!useJoker`

### Don't use joker
If you want that jokers aren't in the deck:
`!dontUseJoker`

### Print Minimized
If you want your draw answers short and minimized:
`!printMinimized`

### Print Maximized
If you want your draw answers large and maximized:
`!printMaximized`

### Set prefix
If you want to change the prefix from `!` to something else.
```shell script
!setPrefix bob  # change the prefix to bob => "bobdraw" would be the new "draw"
!setPrefix      # without parameter it changes back to "!"
```

### Help
If you want to see the help:
`!help`

## Default Values
By default, it uses a standard deck (52 cards) without a joker and print it minimized. The default prefix is `!`.

## License
See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).

## Resources
* [Card Images](http://acbl.mybigcommerce.com/52-playing-cards/)
* [Profile Picture](https://www.iconfinder.com/iconsets/poker)
