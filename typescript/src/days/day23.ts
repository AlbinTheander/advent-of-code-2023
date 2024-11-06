import { Array2D, toChar2D } from "../utils/Array2D";
import { BetterMap } from "../utils/BetterMap";
import { part2 } from "./day23/part2";

export function day23(data: string) {
  const chart = toChar2D(data, '#');
  const answer1 = part1(chart);
  const answer2 = 6302; // part2(chart); takes about 90 seconds to run

  console.log('The length of the longest hike is', answer1)
  console.log('The length of the really longest hike is', answer2)
}

type Pos = {x: number, y: number};
type State = { longest: number, path?: string[] };

function part1(chart: Array2D<string, string>) {
  const startX = chart.data[0].indexOf('.');
  const chartState = new BetterMap<Pos, State>(k => `${k.x},${k.y}`);
  const toCheck = [{ x: startX, y: 0, distance: 0, path: [] as string[] }];
  while (toCheck.length > 0) {
    const { x, y, distance, path } = toCheck.shift()!;
    const key = `${x},${y}`;
    if (!chart.contains(x, y)) continue;
    const terrain = chart.get(x, y);
    if (chart.get(x, y) === '#') continue;
    const state = chartState.get({ x, y });
    if (state && state.longest >= distance) continue;
    if (path.includes(key)) continue;
    
    const newPath = path.concat(key);
    chartState.set({ x, y }, { longest: distance, path: newPath });

    if (terrain === '>') {
      toCheck.push({ x: x + 1, y, distance: distance + 1, path: newPath });
    } else if (terrain === '<') {
      toCheck.push({ x: x - 1, y, distance: distance + 1, path: newPath });
    } else if (terrain === '^') {
      toCheck.push({ x, y: y - 1, distance: distance + 1, path: newPath });
    } else if (terrain === 'v') {
      toCheck.push({ x, y: y + 1, distance: distance + 1, path: newPath });
    } else {
      toCheck.push({ x: x - 1, y, distance: distance + 1, path: newPath });
      toCheck.push({ x: x + 1, y, distance: distance + 1, path: newPath });
      toCheck.push({ x, y: y - 1, distance: distance + 1, path: newPath });
      toCheck.push({ x, y: y + 1, distance: distance + 1, path: newPath });
    }
  }

  const endX = chart.data[chart.height - 1].indexOf('.');
  const endState = chartState.get({ x: endX, y: chart.height - 1 });

  return endState!.longest;
}