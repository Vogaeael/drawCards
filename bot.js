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


require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
let deck = new Deck();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    switch (msg.content) {
        case 'shuffle':
            deck = new Deck();
            msg.reply('shuffled Deck');
            break;
        case 'draw':
            let card = deck.draw();
            if (undefined === card) {
                msg.reply('out of cards');
            } else {
                msg.reply('got a ' + card.getRank() + ' ' + card.getSuit());
            }
            break;
    }
});

client.login(process.env.DISCORD_TOKEN);
