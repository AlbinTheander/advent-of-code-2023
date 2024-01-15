import { lcm } from "../utils/math";

type Turn = {
    from: string,
    left: string,
    right: string
}

export function day08(data: string) {
    const [instructions, map] = parseData(data);
    const value1 = part1(instructions, map);
    const value2 = part2(instructions, map);
    console.log('The camel will reach its destination in', value1, 'steps');
    console.log('The ghosts will reach their destination in', value2, 'steps');
}

function part1(instructions: string, map: Turn[]) {
    let pos = 'AAA';
    let steps = 0;
    while (pos != 'ZZZ') {
        const turn = map.find(t => t.from === pos);
        const dir = instructions[steps % instructions.length];
        steps++;
        pos = dir === 'L' ? turn.left : turn.right;
    }
    return steps;
}

function part2(instructions: string, map: Turn[]) {
    // Tried this before, and each position that ends with an A
    // will nicely loop around to exactly one position ending with Z. It could
    // have been messier. :-)
    const startPositions = map.map(t => t.from).filter(p => p.endsWith('A'));
    const loopLengths = []
    for (let pos of startPositions) {
        let steps = 0;
        while (!pos.endsWith('Z')) {
            const turn = map.find(t => t.from === pos);
            const dir = instructions[steps % instructions.length];
            steps++;
            pos = dir === 'L' ? turn.left : turn.right;
        }
        loopLengths.push(steps);
    }
    return lcm(...loopLengths);
}

function parseData(data: string): [string, Turn[]] {
    const lines = data.split('\n');
    const instructions = lines.shift();
    lines.shift();
    const map = lines.map(line => {
        const [from, left, right] = line.match(/[0-9A-Z]{3}/g);
        return { from, left, right };
    })

    return [instructions, map]
}
