// Run dotenv
//import { Deck } from "src/deck";
//require('src/deck');
//import { suits } from "./src/suits";
//import { ranks } from "./src/ranks";

const ranks = {
    ace: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    jack: 11,
    queen: 12,
    king: 13
}

const suits = {
    clubs: "clubs",
    diamonds: "diamonds",
    hearts: "hearts",
    spades: "spades"
}

class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
    }

    getRank() {
        return this.rank;
    }

    getSuit() {
        return this.suit;
    }
}

class Deck {
    constructor() {
        this.fill();
        this.shuffle();
    }

    fill() {
        this.cards = [];

        Object.entries(suits).forEach(suit => {
            Object.entries(ranks).forEach(rank => {
                this.cards.push(new Card(suit[0], rank[0]));
            })
        });
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    draw() {
        return this.cards.pop();
    }

    count() {
        return this.cards.length;
    }
}

class DrawCardsBot {
    constructor(client, prefix = '!') {
        this.client = client;
        this.prefix = prefix;
        this.initDecks();
        this.initListeners();
    }

    initListeners() {
        this.initMessageListener()
    }

    initMessageListener() {
        this.client.on('message', (msg) => {
            const guildID = msg.guild.id;
            switch (msg.content) {
                case this.prefix + 'shuffle':
                    msg.reply(this.shuffle(guildID));
                    break;
                case this.prefix + 'draw':
                    msg.reply(this.draw(guildID));
                    break;
                case this.prefix + 'help':
                    msg.reply(this.help());
                    break;
            }
        });
    }

    shuffle(guildID) {
        this.initDeck(guildID)
        return 'shuffled Deck';
    }

    draw(guildID) {
        const deck = this.decks[guildID];
        if (undefined === deck) {
            return 'out of cards';
        }

        const card = deck.draw();
        if (undefined === card) {
            return 'out of cards';
        }

        return 'got a :' + card.getSuit() + ':(' + capitalize(card.getSuit()) + ') ' + capitalize(card.getRank());
    }

    initDeck(guildID) {
        this.decks[guildID] = new Deck();
    }

    initDecks() {
        this.decks = [];
    }


    help() {
        return '\n> # Draw Cards\n' +
            '> a bot for drawing random cards\n' +
            '> **Available commands:**\n' +
            '> *!shuffle*\n' +
            '> shuffle the hole deck new\n' +
            '> \n' +
            '> *!draw*\n' +
            '> draw a card of the deck\n' +
            '> \n' +
            '> *!help*\n' +
            '> get this help information\n' +
            '> \n' +
            '> ## more Infos\n' +
            '> Github: https://github.com/Vogaeael/drawCards'
    }
}


require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '!';

const bot = new DrawCardsBot(client, prefix);

function capitalize(string) {
    let nString = string.toString().charAt(0).toUpperCase();
    nString += string.slice(1).toLowerCase();

    return nString;
}

client.login(process.env.DISCORD_TOKEN);
