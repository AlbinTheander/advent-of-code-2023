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

function part1(map: Array2D<number, number>) {
    return getMinimumHeatLoss(map, 0, 3);
}

function part2(map: Array2D<number, number>) {
    return getMinimumHeatLoss(map, 4, 10);
}

type State = {
    x: number, // Position
    y: number,
    dx: number, // Direction
    dy: number,
    steps: number, // Taken steps in the current direction
    heatLoss: number // Total heatloss so far
};

function getMinimumHeatLoss(map: Array2D<number, number>, minStepsForward: number, maxStepsForward: number) {
    // Keep track of the best heat values for each state
    const best = new DefaultMap<State, number>(
        (a) => [a.x, a.y, a.dx, a.dy, a.steps].toString(),
        Infinity
    );

    // A priority queue with states that we should try, sorted by heatloss.
    // Since we are trying the minimum things first, this means that we will
    // have found the optimal solution as soon as we reach the goal.
    const toTry = new PriorityQueue<State>((s1, s2) => s1.heatLoss < s2.heatLoss);
    toTry.add({x: 0, y: 0, dx: 1, dy: 0, steps: 0, heatLoss: 0})
    toTry.add({x: 0, y: 0, dx: 0, dy: 1, steps: 0, heatLoss: 0})
    
    // We'll never run out of states to try, unless we did something wrong. :-)
    while(toTry.size > 0) {
        const state = toTry.pop();
        const {x, y, dx, dy, steps, heatLoss} = state;

        // If we already visited this state with a lower heatloss, no need to try again
        // Note: This cutoff can probably be better optimized, by checking all states
        // in this position and direction with a lower number of steps.
        if (best.get(state) <= heatLoss) continue;
        best.set(state, heatLoss);

        // Did we reach our goal? Woohoo!!!
        if (x == map.width-1 && y == map.height-1) {
            return heatLoss;
        }

        // Forward
        if (steps < maxStepsForward && map.contains(x+dx, y+dy)) {
            const newHeat = heatLoss + map.get(x+dx, y+dy);
            toTry.add({x: x+dx, y: y+dy, dx, dy, steps: steps+1, heatLoss: newHeat });
        }

        // Turn left
        const [leftDx, leftDy] = [dy, -dx];
        if (steps >= minStepsForward && map.contains(x + leftDx, y + leftDy)) {
            const newHeat = heatLoss + map.get(x+leftDx, y+leftDy);
            toTry.add({x: x+leftDx, y: y+leftDy, dx: leftDx, dy: leftDy, steps: 1, heatLoss: newHeat})
        }

        // Turn right
        const [rightDx, rightDy] = [-dy, dx];
        if (steps >= minStepsForward && map.contains(x + rightDx, y + rightDy)) {
            const newHeat = heatLoss + map.get(x+rightDx, y+rightDy);
            toTry.add({x: x+rightDx, y: y+rightDy, dx: rightDx, dy: rightDy, steps: 1, heatLoss: newHeat})
        }
    }
    // We should never get here!
    console.log('Awwwww');
}
