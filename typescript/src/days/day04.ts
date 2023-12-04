type Ticket = {
    id: number,
    wins: number[],
    mine: number[],
    copies: number
}

export function day04(data: string) {
    const tickets = parseTickets(data);
    const result1 = part1(tickets);
    const result2 = part2(tickets);

    console.log('Total number of points is', result1);
    console.log('Total number of tickets is', result2);
}

function parseTickets(data: string): Ticket[] {
    return data
        .split('\n')
        .map(line => {
            const [idPart, winningPart, myParts] = line.split(/[:|]/g);

            const id = +idPart.match(/\d+/g)[0];
            const wins = winningPart.match(/\d+/g).map(Number);
            const mine = myParts.match(/\d+/g).map(Number);
            return { id, wins, mine, copies: 1 };
        })
}

function part1(tickets: Ticket[]) {
    const scores = tickets
        .map(({ wins, mine }) => {
            const winningNumbers = mine.filter(m => wins.includes(m)).length;
            return winningNumbers === 0 ? 0 : (2 ** (winningNumbers - 1));
        })

    return scores.reduce((a, b) => a + b);
}

function part2(tickets: Ticket[]) {
    let count = 0;

    for(let i = 0; i < tickets.length; i++) {
        const { wins, mine, copies } = tickets[i];
        count += copies;

        const winningNumbers = mine.filter(m => wins.includes(m)).length;
        for(let j = 1; j <= winningNumbers; j++) {
            tickets[j+i].copies += copies
        }
    }
    
    return count;
}