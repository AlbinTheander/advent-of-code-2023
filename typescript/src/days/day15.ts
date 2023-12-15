import { sum } from "../utils/utils";

export function day15(data: string) {
    const lenses = data.split('\n').flatMap(line => line.split(','));
    const value1 = part1(lenses);
    const value2 = part2(lenses);

    console.log('The sum of all the hashes is', value1);
    console.log('The total focusing power is', value2);
}

function part1(lenses: string[]) {
    const result = lenses.map(hash).reduce(sum);
    return result;
}

function part2(lenses: string[]) {
    const hashmap = Array(256).fill(null).map(() => []);

    for(const s of lenses) {
        if (s.includes('=')) {
            const [label, val] = s.split('=');
            const box = hash(label);
            const values = hashmap[box];
            const index = values.findIndex(v => v[0] === label);
            if (index === -1) {
                values.push([label, +val]);
            } else {
                values[index] = [label, +val];
            }
        } else if (s.includes('-')) {
            const [label] = s.split('-');
            const box = hash(label);
            const values = hashmap[box];
            const index = values.findIndex(v => v[0] === label);
            if (index > -1) values.splice(index, 1);
        }
    }
    let score = 0;
    for (let box = 0; box < hashmap.length; box++) {
        for (let i = 0; i < hashmap[box].length; i++) {
            score += (box + 1) * (i + 1) * hashmap[box][i][1];
        }
    }
    return score;
}

function hash(s: string): number {
    let result = 0;
    for (const ch of [...s]) {
        const val = ch.charCodeAt(0);
        result = (result + val) * 17 % 256;
    }
    return result;
}

