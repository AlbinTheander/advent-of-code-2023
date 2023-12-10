import { Array2D, toChar2D } from "../utils/Array2D";

export function day10(data: string) {
  const { x, y, pipes } = parseData(data);
  const value1 = part1(pipes, x, y);
  const { pipes: cleanPipes } = parseData(data);
  const value2 = part2(pipes, cleanPipes);

  console.log("The maximum distance from the start is", value1);
  console.log("The number of enclosed positions is", value2);
}

function part1(pipes: Array2D<string, string>, startX: number, startY: number) {
  let x = startX;
  let y = startY;
  let steps = 0;
  do {
    steps++;
    const current = pipes.get(x, y);
    pipes.set(x, y, "X");
    if (canGoUp(current) && canGoDown(pipes.get(x, y - 1))) y--;
    else if (canGoRight(current) && canGoLeft(pipes.get(x + 1, y)))
      x++;
    else if (canGoDown(current) && canGoUp(pipes.get(x, y + 1)))
      y++;
    else if (canGoLeft(current) && canGoRight(pipes.get(x - 1, y)))
      x--;
    else break;
  } while (x !== startX || y !== startY);
  return steps / 2;
}

function part2(
  markedMap: Array2D<string, string>,
  pipes: Array2D<string, string>
) {
  for (let x = 0; x < pipes.width; x++) {
    for (let y = 0; y < pipes.height; y++) {
      if (markedMap.get(x, y) === "X") {
        continue;
      }
      let jumps = 0;
      let up = false;
      let down = false;
      for (let x1 = 0; x1 <= x; x1++) {
        const c = pipes.get(x1, y);
        const marked = markedMap.get(x1, y) === "X";
        if (marked && canGoUp(c)) up = !up;
        if (marked && canGoDown(c)) down = !down;
        if (up && down) {
          jumps++;
          up = down = false;
        }
      }
      const result = jumps % 2 === 0 ? "O" : "I";
      pipes.set(x, y, result);
    }
  }

  return pipes.toString().match(/I/g).length;
}

function parseData(data: string): {
  x: number;
  y: number;
  pipes: Array2D<string, string>;
} {
  const pipes = toChar2D(data, ".");
  const y = pipes.data.findIndex((line) => line.includes("S"));
  const x = pipes.data[y].indexOf("S");
  const up = canGoDown(pipes.get(x, y - 1));
  const down = canGoUp(pipes.get(x, y + 1));
  const left = canGoRight(pipes.get(x - 1, y));
  const right = canGoLeft(pipes.get(x + 1, y));

  if (up && down) pipes.set(x, y, "|");
  if (up && left) pipes.set(x, y, "J");
  if (up && right) pipes.set(x, y, "L");
  if (left && right) pipes.set(x, y, "-");
  if (down && left) pipes.set(x, y, "7");
  if (down && right) pipes.set(x, y, "F");
  return { x, y, pipes };
}

const canGoUp = (ch: string) => "|JL".includes(ch);
const canGoDown = (ch: string) => "|F7".includes(ch);
const canGoLeft = (ch: string) => "-J7".includes(ch);
const canGoRight = (ch: string) => "-FL".includes(ch);
