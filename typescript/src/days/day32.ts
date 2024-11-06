import { Array2D, toChar2D } from "../utils/Array2D";
import { DefaultMap } from "../utils/DefaultMap";

type Pos = { x: number; y: number };

export function day32(data: string) {
    const chart = toChar2D(data, "#");
    const intersections = getIntersections(chart);
    intersections.unshift({ x: 1, y: 0 });
    intersections.push({ x: chart.width - 2, y: chart.height - 1 });
    const graph = buildIntersectionGraph(chart, intersections);
    console.log(graph);
    findLongestPath(graph);
}

function findLongestPath(
    graph: Map<string, { id: string; distance: number }[]>
) {
    const best = new DefaultMap<string, number>((k) => k, 0);
    const toCheck = [{ id: "1,0", distance: 0, visited: new Set<string>() }];
    let n = 0;
    while (toCheck.length > 0) {
        const { id, distance, visited } = toCheck.pop()!;
        if (++n % 1000000 === 0) console.log(n, toCheck.length, id, distance);
        if (visited.has(id)) continue;
        const currentBest = best.get(id);
        if (distance > currentBest) best.set(id, distance);

        for (const { id: nextId, distance: nextDistance } of graph.get(id)) {
            toCheck.push({
                id: nextId,
                distance: distance + nextDistance,
                visited: new Set<string>(visited).add(id),
            });
        }
    }
    console.log(best);
}

function getIntersections(chart: Array2D<string, string>) {
    const intersections: Pos[] = [];
    for (let y = 0; y < chart.height; y++) {
        for (let x = 0; x < chart.width; x++) {
            if (chart.get(x, y) !== "#") {
                const neighbors = [
                    { x: x - 1, y },
                    { x: x + 1, y },
                    { x, y: y - 1 },
                    { x, y: y + 1 },
                ]
                    .map(({ x, y }) => chart.get(x, y))
                    .filter((c) => c !== "#");
                if (neighbors.length > 2) {
                    intersections.push({ x, y });
                }
            }
        }
    }
    return intersections;
}

function buildIntersectionGraph(
    chart: Array2D<string, string>,
    intersections: Pos[]
) {
    const posToString = ({ x, y }: Pos) => `${x},${y}`;
    const intersectionKeys = intersections.map(posToString);
    const connections = new DefaultMap<Pos, (Pos & { distance: number })[]>(
        posToString,
        []
    );
    for (const intersection of intersections) {
        const toCheck = [{ ...intersection, distance: 0 }];
        const visited = new Set<string>();
        while (toCheck.length > 0) {
            const { x, y, distance } = toCheck.shift()!;
            const key = posToString({ x, y });
            if (!chart.contains(x, y)) continue;
            if (chart.get(x, y) === "#") continue;
            if (visited.has(key)) continue;
            visited.add(key);
            if (
                (x !== intersection.x || y !== intersection.y) &&
                intersectionKeys.includes(key)
            ) {
                connections.set(
                    intersection,
                    connections.get(intersection).concat({ x, y, distance })
                );
                continue;
            }
            const neighbors = [
                { x: x - 1, y, distance: distance + 1 },
                { x: x + 1, y, distance: distance + 1 },
                { x, y: y - 1, distance: distance + 1 },
                { x, y: y + 1, distance: distance + 1 },
            ];
            for (const neighbor of neighbors) {
                toCheck.push(neighbor);
            }
        }
    }
    const graph = new Map<string, { id: string; distance: number }[]>();
    for (const { x, y } of connections.keys) {
        const conns = connections
            .get({ x, y })
            .map(({ x, y, distance }) => ({
                id: posToString({ x, y }),
                distance,
            }));
        graph.set(posToString({ x, y }), conns);
    }
    return graph;
}
