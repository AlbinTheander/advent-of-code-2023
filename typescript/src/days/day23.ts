import { Array2D, toChar2D } from "../utils/Array2D";
import { BetterMap } from "../utils/BetterMap";
import { DefaultMap } from "../utils/DefaultMap";

export function day23(data: string) {
  const chart = toChar2D(data, '#');
  part1(chart);
  part2(chart);
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
  console.log(chartState.get({ x: endX, y: chart.height - 1 }));

  console.log('Done');
}

function part2(chart: Array2D<string, string>) {
  const startX = chart.data[0].indexOf('.');
  const maxChart: number[][] = [];
  for (let y = 0; y < chart.height; y++)
    maxChart.push(Array(chart.width).fill(0));
  const toCheck = [{ x: startX, y: 0, distance: 0, visited: new Set<string>() }];
  let n = 0;
  while (toCheck.length > 0) {
    if (++n % 100000 === 0) console.log(n);
    const { x, y, distance, visited } = toCheck.shift()!;

    if (chart.get(x, y) === '#') continue;
    const key = `${x},${y}`;
    if (visited.has(key)) continue;

    const newVisited = new Set(visited).add(key);
    const prevMax = maxChart[y][x];
    if (prevMax < distance)
      maxChart[y][x] = distance;

    toCheck.push({ x: x - 1, y, distance: distance + 1, visited: newVisited });
    toCheck.push({ x: x + 1, y, distance: distance + 1, visited: newVisited });
    toCheck.push({ x, y: y - 1, distance: distance + 1, visited: newVisited });
    toCheck.push({ x, y: y + 1, distance: distance + 1, visited: newVisited });
  }

  const endX = chart.data[chart.height - 1].indexOf('.');
  const endState = maxChart[chart.height - 1][endX];
  console.log(endState);

  // console.log('up', chartState.get({ x: 19, y: 18 }));
  // console.log('left', chartState.get({ x: 18, y: 19 }));
  // console.log('on', chartState.get({ x: 19, y: 19 }));

  console.log('4858 is too low');
}
