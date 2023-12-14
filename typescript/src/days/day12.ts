import { sum } from "../utils/utils";

type Problem = {
    line: string,
    hints: number[];
}

export function day12(data: string) {
    const problems = parseData(data);
    const value1 = part1(problems);
    const value2 = part2(problems);

    console.log('The total numbers of solutions is', value1);
    console.log('The solutions to the 5x-problems is', value2);
}

function part1(problems: Problem[]) {
    const result = problems.map(p => solve(p.line, p.hints)).reduce(sum);
    return result;
}

let cache = new Map<string, number>();

function part2(problems: Problem[]) {
    const longerProblems = problems.map(({ line, hints }) => {
        const longLine = [line, line, line, line, line].join('?');
        const longHints = [hints, hints, hints, hints, hints].flat();
        return { line: longLine, hints: longHints }
    });

    const result = longerProblems.map((p, i) => {
        cache = new Map<string, number>();
        return solve(p.line, p.hints)
    }).reduce(sum);
    return result;
}

function solve(line: string, hints: number[], first = true): number {
    let key = JSON.stringify([line, hints]);
    if (cache.has(key)) return cache.get(key);
    if (hints.length === 0) {
        const hasHashes = line.includes('#');
        return hasHashes ? 0 : 1;
    }
    let p = 0;
    // If this isn't the first one, we need at least one dot
    if (!first) {
        if (line[0] === '#') return 0;
        p += 1;
    }

    // Move past all the dots
    while (p < line.length && line[p] === '.') p++;

    const hint = hints[0];
    const restHints = hints.slice(1);
    let foundHash = false;
    let count = 0;
    while(p + hint <= line.length && !foundHash) {
        if (foundHash && line[p] === '.') break;
        foundHash = foundHash || line[p] === '#';
        if (validHint(line, p, hint)) {
            count += solve(line.slice(p+hint), restHints, false);
        }
        p++;
    }
    cache.set(key, count);
    return count;
}

function validHint(s: string, pos: number, hint: number): boolean {
    for (let i = pos; i < pos + hint; i++)
        if (i >= s.length || s[i] === '.') return false;

    return true;
}


function parseData(data: string): Problem[] {
    return data
        .split('\n')
        .map(lineData => {
            const [line, nums] = lineData.split(' ');
            const hints = nums.match(/\d+/g).map(Number);
            return { line, hints };
        })
}