import { Array2D, toChar2D } from "../utils/Array2D";
import { BetterMap } from "../utils/BetterMap";
import { Infinite2DSet } from "../utils/Infinite2DSet";

export function day16(data: string) {
    const grid = toChar2D(data, "X");
    const value1 = part1(grid);
    const value2 = part2(grid);

    console.log("The total energy is", value1);
    console.log("The max energy is", value2);
}

function part1(grid: Array2D<string, string>) {
    return getEnergized(grid, 0, 0, 1, 0);
}

function part2(grid: Array2D<string, string>) {
    let best = -Infinity;
    for (let y = 0; y < grid.height; y++) {
        const e1 = getEnergized(grid, 0, y, 1, 0);
        const e2 = getEnergized(grid, grid.width - 1, y, -1, 0);
        best = Math.max(best, e1, e2);
    }
    for (let x = 0; x < grid.width; x++) {
        const e1 = getEnergized(grid, x, 0, 0, 1);
        const e2 = getEnergized(grid, x, grid.height - 1, 0, -1);
        best = Math.max(best, e1, e2);
    }
    return best;
}

type Visited = {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
};
type Pos = {
    x: number;
    y: number;
};

function getEnergized(
    grid: Array2D<string, string>,
    x0: number,
    y0: number,
    dx0: number,
    dy0: number
): number {
    const energized = new Infinite2DSet();
    const visited = new BetterMap<Pos, Visited>(({ x, y }) => `${x}-${y}`);

    const toFollow = [{ x: x0, y: y0, dx: dx0, dy: dy0 }];
    while (toFollow.length > 0) {
        let { x, y, dx, dy } = toFollow.pop();
        let following = true;
        while (following) {
            if (!grid.contains(x, y)) break;
            const ch = grid.get(x, y);
            const prevVisit = visited.get({ x, y }) || {
                up: false,
                down: false,
                left: false,
                right: false,
            };
            if (prevVisit.up && dy === -1) break;
            if (prevVisit.down && dy === 1) break;
            if (prevVisit.left && dx === -1) break;
            if (prevVisit.right && dx === 1) break;
            prevVisit.up = prevVisit.up || dy === -1;
            prevVisit.down = prevVisit.down || dy === 1;
            prevVisit.left = prevVisit.left || dx === -1;
            prevVisit.right = prevVisit.right || dx === 1;
            visited.set({ x, y }, prevVisit);
            energized.add(x, y);
            switch (ch) {
                case "X":
                    following = false;
                    break;
                case ".":
                    break;
                case "/": {
                    [dx, dy] = [-dy, -dx];
                    break;
                }
                case "\\": {
                    [dx, dy] = [dy, dx];
                    break;
                }
                case "|": {
                    if (dx !== 0) {
                        toFollow.push({ x, y: y - 1, dx: 0, dy: -1 });
                        toFollow.push({ x, y: y + 1, dx: 0, dy: 1 });
                        following = false;
                    }
                    break;
                }
                case "-": {
                    if (dy !== 0) {
                        toFollow.push({ x: x - 1, y, dx: -1, dy: 0 });
                        toFollow.push({ x: x + 1, y, dx: 1, dy: 0 });
                        following = false;
                    }
                    break;
                }
            }
            x += dx;
            y += dy;
        }
    }
    return energized.size;
}
