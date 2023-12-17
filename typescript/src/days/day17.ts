import { Array2D, toNum2D } from "../utils/Array2D";
import { DefaultMap } from "../utils/DefaultMap";
import { PriorityQueue } from "../utils/PriorityQueue";

export function day17(data: string) {
    const map = toNum2D(data, Infinity);
    const result1 = part1(map);
    const result2 = part2(map);

    console.log('The minimum heat loss for the crucible is', result1);
    console.log('The minimum heat loss for the ultra crucible is', result2);
}

type State = {
    x: number,
    y: number,
    dx: number,
    dy: number,
    steps: number,
    heat: number
};

function part1(map: Array2D<number, number>) {
    const best = new DefaultMap<State, number>(
        (a) => [a.x, a.y, a.dx, a.dy, a.steps].toString(),
        Infinity
    );

    const toTry = new PriorityQueue<State>((s1, s2) => s1.heat < s2.heat);
    toTry.add({x: 0, y: 0, dx: 1, dy: 0, steps: 0, heat: 0})
    toTry.add({x: 0, y: 0, dx: 0, dy: 1, steps: 0, heat: 0})
    
    while(toTry.size > 0) {
        const state = toTry.pop();
        const {x, y, dx, dy, steps, heat} = state;
        if (best.get(state) <= heat) continue;
        best.set(state, heat);

        if (x == map.width-1 && y == map.height-1) {
            return heat;
        }
        if (steps < 3 && map.contains(x+dx, y+dy)) {
            const newHeat = heat + map.get(x+dx, y+dy);
            toTry.add({x: x+dx, y: y+dy, dx, dy, steps: steps+1, heat: newHeat });
        }
        const [leftDx, leftDy] = [dy, -dx];
        if (map.contains(x + leftDx, y + leftDy)) {
            const newHeat = heat + map.get(x+leftDx, y+leftDy);
            toTry.add({x: x+leftDx, y: y+leftDy, dx: leftDx, dy: leftDy, steps: 1, heat: newHeat})
        }
        const [rightDx, rightDy] = [-dy, dx];
        if (map.contains(x + rightDx, y + rightDy)) {
            const newHeat = heat + map.get(x+rightDx, y+rightDy);
            toTry.add({x: x+rightDx, y: y+rightDy, dx: rightDx, dy: rightDy, steps: 1, heat: newHeat})
        }
    }
    console.log('Awwwww');
}

function part2(map: Array2D<number, number>) {
    const best = new DefaultMap<State, number>(
        (a) => [a.x, a.y, a.dx, a.dy, a.steps].toString(),
        Infinity
    );

    const toTry = new PriorityQueue<State>((s1, s2) => s1.heat < s2.heat);
    toTry.add({x: 0, y: 0, dx: 1, dy: 0, steps: 0, heat: 0})
    toTry.add({x: 0, y: 0, dx: 0, dy: 1, steps: 0, heat: 0})
    
    while(toTry.size > 0) {
        const state = toTry.pop();
        const {x, y, dx, dy, steps, heat} = state;
        if (best.get(state) <= heat) continue;
        best.set(state, heat);

        if (x == map.width-1 && y == map.height-1) {
            return heat;
        }
        if (steps < 10 && map.contains(x+dx, y+dy)) {
            const newHeat = heat + map.get(x+dx, y+dy);
            toTry.add({x: x+dx, y: y+dy, dx, dy, steps: steps+1, heat: newHeat });
        }
        const [leftDx, leftDy] = [dy, -dx];
        if (steps >= 4 && map.contains(x + leftDx, y + leftDy)) {
            const newHeat = heat + map.get(x+leftDx, y+leftDy);
            toTry.add({x: x+leftDx, y: y+leftDy, dx: leftDx, dy: leftDy, steps: 1, heat: newHeat})
        }
        const [rightDx, rightDy] = [-dy, dx];
        if (steps >= 4 && map.contains(x + rightDx, y + rightDy)) {
            const newHeat = heat + map.get(x+rightDx, y+rightDy);
            toTry.add({x: x+rightDx, y: y+rightDy, dx: rightDx, dy: rightDy, steps: 1, heat: newHeat})
        }
    }
    console.log('Awwwww');
}
