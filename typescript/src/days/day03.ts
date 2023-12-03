import { BetterMap } from "../utils/BetterMap";
import { DefaultMap } from "../utils/DefaultMap";

export function day03(data: string) {
    const lines = data.split('\n');
    const result1 = part1(lines);
    const result2 = part2(lines);

    console.log('The sum of all part numbers is', result1);
    console.log('The sum of all gear ratios is', result2);
}

function part1(lines: string[]) {
    const inside = (x, y) => x >= 0 && x < lines[0].length && y >= 0 && y < lines.length;
    const get = (x, y) => inside(x, y) ? lines[y][x] : '.';

    let currentNum = '';
    let sum = 0;
    for(let y = 0; y <= lines.length; y++) {
        for (let x = 0; x <= lines[0].length; x++) {
            const ch = get(x, y);
            if (ch >= '0' && ch <= '9') {
                currentNum += ch;
            } else if (currentNum != '') {
                let added = false;
                let num = +currentNum;
                for (let x1 = x - currentNum.length-1; x1 <= x; x1++) {
                    for (let y1 = y-1; y1 <= y+1; y1++) {
                        const neighbour = get(x1, y1);
                        if (!'.0123456789'.includes(neighbour)) {
                            added = true;
                            sum += num;
                            num = 0;
                        }
                    }
                }
                currentNum = '';
            }
        }
    }
    return sum;
}

function part2(lines: string[]) {
    const inside = (x, y) => x >= 0 && x < lines[0].length && y >= 0 && y < lines.length;
    const get = (x, y) => inside(x, y) ? lines[y][x] : '.';
    const gears = new DefaultMap<[number, number], number[]>((pos) => JSON.stringify(pos), [])

    let currentNum = '';
    for(let y = 0; y <= lines.length; y++) {
        for (let x = 0; x <= lines[0].length; x++) {
            const ch = get(x, y);
            if (ch >= '0' && ch <= '9') {
                currentNum += ch;
            } else if (currentNum != '') {
                let num = +currentNum;
                for (let x1 = x - currentNum.length-1; x1 <= x; x1++) {
                    for (let y1 = y-1; y1 <= y+1; y1++) {
                        const neighbour = get(x1, y1);
                        if (neighbour === '*') {
                            const oldGears = gears.get([x1, y1]);
                            gears.set([x1, y1], [...oldGears, num]);
                        }
                    }
                }
                currentNum = '';
            }
        }
    }

    let sum = 0;
    [...gears.values].forEach((nums) => {
        if (nums.length === 2) {
            const gearNum = nums[0] * nums[1];
            sum += gearNum

        }
    })

    return sum;
}