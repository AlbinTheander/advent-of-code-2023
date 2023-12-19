import { Infinite2DSet } from "../utils/infinite2DSet";

type Instruction = {
    dir: string,
    len: number,
    dir2: string,
    len2: number,
    color: string
}

export function day18(data: string) {
    const instructions = parseData(data);
    part1(instructions);
    part2(instructions);
}

function part1(instructions: Instruction[]) {
    const points = new Infinite2DSet();
    let x = 0, y = 0;
    for (const { dir, len } of instructions) {
        const dx = dir === 'L' ? -1 : dir === 'R' ? 1 : 0;
        const dy = dir === 'U' ? -1 : dir === 'D' ? 1 : 0;
        for (let i = 0; i < len; i++) {
            x += dx;
            y += dy;
            points.add(x, y);
        }
    }
    console.log(points.toString())
    floodfill(points, 1, 1);
    console.log(points.size);
}

function part2(instructions: Instruction[]) {
    const points = new Infinite2DSet();
    let x = 0, y = 10;
    let area = 0
    let prevDir = instructions.at(-1).dir;
    for (const { dir2: dir, len2: len } of instructions) {
        const dx = dir === 'L' ? -1 : dir === 'R' ? 1 : 0;
        const dy = dir === 'U' ? 1 : dir === 'D' ? -1 : 0;
        const y1 = y + dy * len
        const x1 = x + dx * len
        if (dir === 'R') {
            area += (x1 - x - 1) * (y + 1)
        }
        if (prevDir === 'R' && dir === 'D') {
            area += y+1;
        }
        if (prevDir === 'L' && dir === 'D') {
            // area += (y + 1)
        }
        if (prevDir === 'D' && dir === 'L') {
            area -= y;
        }
        if (prevDir === 'U' && dir === 'L') {
            // area += y+1
        }
        if (prevDir === 'U' && dir === 'R') {
            area += y+1
        }
        if (prevDir === 'D' && dir === 'R') {
            // area -= y;
        }
        if (prevDir === 'L' && dir === 'U') {
            area -= y
        }
        if (prevDir === 'R' && dir == 'U') {
            // area -= y
        }
        if (dir === 'L') {
            area -= (x - x1 - 1) * y;
        }

        // console.log(dir, len, area);
        x = x1;
        y = y1;
        prevDir = dir;
    }
    console.log(area);
}

function floodfill(map: Infinite2DSet, startX: number, startY: number) {
    const [minX, minY, maxX, maxY] = map.bounds;
    const toTry = [[startX, startY]];
    while (toTry.length > 0) {
        const [x, y] = toTry.pop();
        if (x < minX || x > maxX || y < minY || y > maxY) continue;
        map.add(x, y);
        if (!map.has(x-1, y)) toTry.push([x-1, y]);
        if (!map.has(x+1, y)) toTry.push([x+1, y]);
        if (!map.has(x, y-1)) toTry.push([x, y-1]);
        if (!map.has(x, y+1)) toTry.push([x, y+1]);
    }
}

function parseData(data: string): Instruction[] {
    const lines = data.split('\n');
    return lines.map(line => {
        const [dir, len, col] = line.split(' ');
        const dir2 = 'RDLU'[col.slice(-2, -1)]
        const len2 = parseInt(col.slice(2, -2), 16)
        return { dir, len: +len, dir2, len2, color: col.slice(1, -1) }
    })
}

