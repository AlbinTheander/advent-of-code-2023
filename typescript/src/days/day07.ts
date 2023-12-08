import { sum } from "../utils/utils";

type Hand = {
    cards: string,
    score: number,
    jokerScore: number,
    bid: number
}

export function day07(data: string) {
    const lines = data.split('\n');
    const hands = lines.map(buildHand);
    const value1 = part1(hands);
    const value2 = part2(hands);

    console.log('Winnings from normal game', value1);
    console.log('Winnings from joker game', value2);
}

function part1(hands: Hand[]) {
    const sorted = [...hands].sort((h1, h2) => h1.score - h2.score);
    const total = sorted.map((h, i) => h.bid * (i +1) ).reduce(sum)
    return total;
}
function part2(hands: Hand[]) {
    const sorted = [...hands].sort((h1, h2) => h1.jokerScore - h2.jokerScore);
    const total = sorted.map((h, i) => h.bid * (i +1) ).reduce(sum)
    return total;
}

function buildHand(s: string): Hand {
    const cards = s.split(' ')[0];
    const bid = +s.split(' ')[1];
    let cardsAsHex = cards.replace(/[TJQKA]/g, (c) => 'ABCDE'['TJQKA'.indexOf(c)]);
    const baseScore = parseInt(cardsAsHex, 16);
    let score = baseScore + getHandTypeScore(cards);
    
    let jokerCardsAsHex = cards.replace(/J/g, '1').replace(/[TJQKA]/g, (c) => 'ABCDE'['TJQKA'.indexOf(c)]);
    let jokerBaseScore = parseInt(jokerCardsAsHex, 16);
    
    const improvedCards = getImprovedCards(cards);
    const jokerScore = jokerBaseScore + getHandTypeScore(improvedCards);
    return { cards, score, jokerScore, bid }
}

function getImprovedCards(cards: string) {
    let newCards = cards;
    while(newCards.includes('J')) {
        const freqs = getFrequences(cards);
        delete freqs.J
        const maxFreq = Math.max(...Object.values(freqs))
        const maxCard = Object.keys(freqs).find(c => freqs[c] === maxFreq && c !== 'J');
        if (!maxCard) break;
        newCards = newCards.replace('J', maxCard);
    }
    return newCards;
}

function getHandTypeScore(cards: string): number {
    const freqs = getFrequences(cards);
    if (Object.keys(freqs).length === 1) {
        // Five of a kind
        return 9e6
    } else if (Object.values(freqs).includes(4)) {
        // Four of a kind
        return 8e6;
    } else if (Object.values(freqs).includes(3) && Object.values(freqs).includes(2)) {
        // Full house
        return 7e6;
    } else if (Object.values(freqs).includes(3)) {
        // Three of a kind
        return 6e6;
    } else if (Object.keys(freqs).length === 3) {
        // Two of a kind
        return 5e6;
    } else if (Object.values(freqs).includes(2)) {
        // Pair
        return 4e6;
    }
    // High card
    return 1e6;
}

function getFrequences(s: string): Record<string, number> {
    const o = {};

    for(let ch of s.split(''))
        o[ch] = (o[ch] || 0) + 1;

    return o;
}