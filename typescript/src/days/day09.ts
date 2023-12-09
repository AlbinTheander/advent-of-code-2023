import { sum } from "../utils/utils";

export function day09(data: string) {
    const seqs = data.split('\n').map(line => line.split(' ').map(Number));
    const value1 = part1(seqs);
    const value2 = part2(seqs);
    
    console.log('The sum of the next values is', value1);
    console.log('The sum of the previous values is', value2);
}

function part1(seqs: number[][]) {
    return seqs.map(findNextNum).reduce(sum)
}

function findNextNum(sequence: number[]): number {
    if (sequence.every(n => n === 0)) return 0;
    const diffs = sequence.slice(1).map((_, i) => sequence[i+1] - sequence[i])
    const next = findNextNum(diffs);
    return next + sequence.at(-1)
}

function part2(seqs: number[][]) {
    return seqs.map(findPrevNum).reduce(sum)
}

function findPrevNum(sequence: number[]): number {
    if (sequence.every(n => n === 0)) return 0;
    const diffs = sequence.slice(1).map((_, i) => sequence[i+1] - sequence[i])
    const prev = findPrevNum(diffs);
    return sequence.at(0) - prev;
}

