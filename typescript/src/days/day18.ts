import { Infinite2DSet } from "../utils/infinite2DSet";

type Instruction = {
    dir: string,
    len: number,
    color: string
}

export function day18(data: string) {
    const instructions = parseData(data);
    part1(instructions);
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
    floodfill(points, 1, 1);
    console.log(points.size);
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
        return { dir, len: +len, color: col.slice(1, -1) }
    })
}

