type Pos = [number, number, number];

type RawBrick = {
    id: number;
    from: Pos;
    to: Pos;
    points: Pos[];
};

type Brick = RawBrick & {
    supporting: number[];
    supportedBy: number[];
};

export function day22(data: string) {
    const bricks = parseBricks(data);
    const result1 = part1(bricks);
    const result2 = part2(bricks);

    console.log("The number of bursts that cause an infection is", result1);
    console.log(
        "The number of bursts that cause an infection with the new rules is",
        result2
    );
}

function part1(bricks: Brick[]): number {
    let count = 0;
    for (const brick of bricks) {
      const supported = brick.supporting.map(id => bricks[id]);
      const singleSupported = supported.filter(b => b.supportedBy.length === 1);
      if (singleSupported.length === 0) {
        count++;
      }
    }
    return count;
}

function part2(bricks: Brick[]): number {
  const counts: number[] = [];
  for (const brick of bricks) {
    const removed = new Set<number>();
    removed.add(brick.id);
    let done = false;
    while (!done) {
      done = true;
      for (const b of bricks) {
        if (removed.has(b.id)) continue;
        if (b.supportedBy.every(id => removed.has(id))) {
          removed.add(b.id);
          done = false;
        }
      }
    }
    counts.push(removed.size-1);

  }
  return counts.reduce((a, b) => a + b, 0);
}

function isOverlapping(brick1: RawBrick, brick2: RawBrick): boolean {
    for (let point of brick1.points) {
        if (
            brick2.points.some(
                (p) =>
                    p[0] === point[0] && p[1] === point[1] && p[2] === point[2]
            )
        ) {
            return true;
        }
    }
    return false;
}

function moveBrick(brick: Brick, dz: number): Brick;
function moveBrick(brick: RawBrick, dz: number) : RawBrick;
function moveBrick(brick: Brick | RawBrick, dz: number): Brick | RawBrick {
    return {
        ...brick,
        from: [brick.from[0], brick.from[1], brick.from[2] + dz],
        to: [brick.to[0], brick.to[1], brick.to[2] + dz],
        points: brick.points.map((p) => [p[0], p[1], p[2] + dz]),
    };
}

function dropBrick(brick: RawBrick, droppedBricks: RawBrick[]): RawBrick {
    while (true) {
        const dropped = moveBrick(brick, -1);
        if (dropped.to[2] === 0 || dropped.from[2] === 0) return brick;
        const collides = droppedBricks.some((droppedBrick) =>
            isOverlapping(dropped, droppedBrick)
        );
        if (collides) return brick;
        brick = dropped;
    }
}

function buildConnections(rawBricks: RawBrick[]): Brick[] {
    return rawBricks
        .map((brick): Brick => ({ ...brick, supporting: [], supportedBy: [] }))
        .map((brick, _, bricks) => {
            if (brick.from[2] === 1 || brick.to[2] === 1) {
                brick.supportedBy.push(-1);
            }
            const raised = moveBrick(brick, 1);
            const supporting = bricks
                .filter((b) => b !== brick && isOverlapping(raised, b))
                .forEach((b) => {
                    brick.supporting.push(b.id);
                    b.supportedBy.push(brick.id);
                });
            return brick;
        });
}

function parseBricks(data: string): Brick[] {
    const rawBricks = data
        .split("\n")
        .map((line, id) => {
            const [from, to] = line
                .split("~")
                .map((p) => p.split(",").map(Number)) as [Pos, Pos];
            const points: Pos[] = [];
            const dx = Math.sign(to[0] - from[0]);
            const dy = Math.sign(to[1] - from[1]);
            const dz = Math.sign(to[2] - from[2]);
            let [x, y, z] = from;
            while (x !== to[0] || y !== to[1] || z !== to[2]) {
                points.push([x, y, z]);
                x += dx;
                y += dy;
                z += dz;
            }
            points.push(to);
            return { from, to, points, id };
        })
        .sort(
            (b1, b2) =>
                Math.min(b1.from[2], b1.to[2]) - Math.min(b2.from[2], b2.to[2])
        )
        .reduce((droppedBricks, brick) => {
            const dropped = dropBrick(brick, droppedBricks);
            droppedBricks.push(dropped);
            return droppedBricks.map((b, id) => ({ ...b, id }));
        }, [] as RawBrick[]);

    return buildConnections(rawBricks);
}
